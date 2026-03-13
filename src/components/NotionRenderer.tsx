import type { BlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";

function RichText({ richText }: { richText: Array<{ plain_text: string; annotations: { bold: boolean; italic: boolean; strikethrough: boolean; underline: boolean; code: boolean }; href: string | null }> }) {
  return (
    <>
      {richText.map((text, i) => {
        let content: React.ReactNode = text.plain_text;
        const { bold, italic, strikethrough, code } = text.annotations;

        if (code) content = <code className="px-1.5 py-0.5 rounded bg-surface-light dark:bg-surface-dark font-mono text-sm text-accent">{content}</code>;
        if (bold) content = <strong>{content}</strong>;
        if (italic) content = <em>{content}</em>;
        if (strikethrough) content = <s>{content}</s>;
        if (text.href) content = <a href={text.href} className="text-accent underline underline-offset-2 hover:text-accent-hover transition-colors" target="_blank" rel="noopener noreferrer">{content}</a>;

        return <span key={i}>{content}</span>;
      })}
    </>
  );
}

function getTextContent(block: BlockObjectResponse): Array<{ plain_text: string; annotations: { bold: boolean; italic: boolean; strikethrough: boolean; underline: boolean; code: boolean }; href: string | null }> {
  const b = block as Record<string, unknown>;
  const typeData = b[block.type] as Record<string, unknown> | undefined;
  return (typeData?.rich_text as Array<{ plain_text: string; annotations: { bold: boolean; italic: boolean; strikethrough: boolean; underline: boolean; code: boolean }; href: string | null }>) || [];
}

export function NotionRenderer({ blocks }: { blocks: BlockObjectResponse[] }) {
  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      {blocks.map((block) => {
        const text = getTextContent(block);

        switch (block.type) {
          case "paragraph":
            return <p key={block.id} className="mb-4 leading-relaxed"><RichText richText={text} /></p>;

          case "heading_1":
            return <h1 key={block.id} className="text-3xl font-bold mt-10 mb-4"><RichText richText={text} /></h1>;

          case "heading_2":
            return <h2 key={block.id} className="text-2xl font-semibold mt-8 mb-3"><RichText richText={text} /></h2>;

          case "heading_3":
            return <h3 key={block.id} className="text-xl font-semibold mt-6 mb-2"><RichText richText={text} /></h3>;

          case "bulleted_list_item":
            return <li key={block.id} className="mb-1 list-disc ml-4"><RichText richText={text} /></li>;

          case "numbered_list_item":
            return <li key={block.id} className="mb-1 list-decimal ml-4"><RichText richText={text} /></li>;

          case "quote":
            return <blockquote key={block.id} className="border-l-2 border-accent pl-4 my-4 italic text-muted-light dark:text-muted-dark"><RichText richText={text} /></blockquote>;

          case "code": {
            const codeBlock = block as Record<string, unknown>;
            const codeData = codeBlock.code as { language?: string } | undefined;
            return (
              <pre key={block.id} className="bg-surface-light dark:bg-surface-dark rounded-lg p-4 my-4 overflow-x-auto">
                <code className="text-sm font-mono" data-language={codeData?.language}>
                  {text.map((t) => t.plain_text).join("")}
                </code>
              </pre>
            );
          }

          case "divider":
            return <hr key={block.id} className="my-8 border-border-light dark:border-border-dark" />;

          case "image": {
            const imageBlock = block as Record<string, unknown>;
            const imageData = imageBlock.image as { type: string; file?: { url: string }; external?: { url: string }; caption?: Array<{ plain_text: string }> } | undefined;
            const url = imageData?.type === "file" ? imageData.file?.url : imageData?.external?.url;
            const caption = imageData?.caption?.map((c) => c.plain_text).join("") || "";
            return (
              <figure key={block.id} className="my-6">
                {url && <img src={url} alt={caption} className="rounded-lg w-full" />}
                {caption && <figcaption className="text-center text-sm text-muted-light dark:text-muted-dark mt-2">{caption}</figcaption>}
              </figure>
            );
          }

          case "callout": {
            const calloutBlock = block as Record<string, unknown>;
            const calloutData = calloutBlock.callout as { icon?: { emoji?: string } } | undefined;
            return (
              <div key={block.id} className="flex gap-3 p-4 my-4 rounded-lg bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark">
                {calloutData?.icon?.emoji && <span className="text-xl">{calloutData.icon.emoji}</span>}
                <div><RichText richText={text} /></div>
              </div>
            );
          }

          default:
            return null;
        }
      })}
    </div>
  );
}
