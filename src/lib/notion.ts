import { Client } from "@notionhq/client";
import type {
  PageObjectResponse,
  BlockObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

const DATABASE_ID = process.env.NOTION_DATABASE_ID!;

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  cover: string | null;
  published: boolean;
}

function getProperty(page: PageObjectResponse, name: string) {
  return page.properties[name];
}

function extractPost(page: PageObjectResponse): BlogPost {
  const titleProp = getProperty(page, "Title") || getProperty(page, "Name");
  const title =
    titleProp?.type === "title"
      ? titleProp.title.map((t) => t.plain_text).join("")
      : "Untitled";

  const slugProp = getProperty(page, "Slug");
  const slug =
    slugProp?.type === "rich_text"
      ? slugProp.rich_text.map((t) => t.plain_text).join("")
      : page.id;

  const descProp = getProperty(page, "Description");
  const description =
    descProp?.type === "rich_text"
      ? descProp.rich_text.map((t) => t.plain_text).join("")
      : "";

  const dateProp = getProperty(page, "Date");
  const date =
    dateProp?.type === "date" ? dateProp.date?.start || "" : page.created_time;

  const tagsProp = getProperty(page, "Tags");
  const tags =
    tagsProp?.type === "multi_select"
      ? tagsProp.multi_select.map((t) => t.name)
      : [];

  const publishedProp = getProperty(page, "Published");
  const published =
    publishedProp?.type === "checkbox" ? publishedProp.checkbox : true;

  const cover = page.cover
    ? page.cover.type === "external"
      ? page.cover.external.url
      : page.cover.file.url
    : null;

  return { id: page.id, slug, title, description, date, tags, cover, published };
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  if (!DATABASE_ID) return [];

  try {
    const response = await notion.dataSources.query({
      data_source_id: DATABASE_ID,
      filter: {
        and: [
          {
            property: "Published",
            checkbox: { equals: true },
          },
        ],
      },
      sorts: [{ property: "Date", direction: "descending" }],
    });

    return response.results
      .filter((page): page is PageObjectResponse => "properties" in page && page.object === "page")
      .map(extractPost);
  } catch {
    console.error("Failed to fetch blog posts from Notion");
    return [];
  }
}

export async function getPostBySlug(
  slug: string
): Promise<BlogPost | null> {
  if (!DATABASE_ID) return null;

  try {
    const response = await notion.dataSources.query({
      data_source_id: DATABASE_ID,
      filter: {
        and: [
          { property: "Slug", rich_text: { equals: slug } },
          { property: "Published", checkbox: { equals: true } },
        ],
      },
    });

    const page = response.results[0];
    if (!page || !("properties" in page) || page.object !== "page") return null;

    return extractPost(page as PageObjectResponse);
  } catch {
    return null;
  }
}

export async function getPostBlocks(
  pageId: string
): Promise<BlockObjectResponse[]> {
  try {
    const blocks: BlockObjectResponse[] = [];
    let cursor: string | undefined;

    do {
      const response = await notion.blocks.children.list({
        block_id: pageId,
        start_cursor: cursor,
        page_size: 100,
      });

      blocks.push(
        ...response.results.filter(
          (block): block is BlockObjectResponse => "type" in block
        )
      );

      cursor = response.has_more ? response.next_cursor ?? undefined : undefined;
    } while (cursor);

    return blocks;
  } catch {
    return [];
  }
}
