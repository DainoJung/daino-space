import { Client } from "@notionhq/client";
import type {
  PageObjectResponse,
  BlockObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

const PROJECTS_DB_ID = process.env.NOTION_PROJECTS_DATABASE_ID!;

export interface Project {
  id: string;
  title: string;
  slug: string;
  year: string;
  description: string;
  order: number;
  thumbnail: string | null;
}

function getProperty(page: PageObjectResponse, name: string) {
  return page.properties[name];
}

function extractProject(page: PageObjectResponse): Project {
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

  const yearProp = getProperty(page, "Year");
  const year =
    yearProp?.type === "rich_text"
      ? yearProp.rich_text.map((t) => t.plain_text).join("")
      : "2025";

  const descProp = getProperty(page, "Description");
  const description =
    descProp?.type === "rich_text"
      ? descProp.rich_text.map((t) => t.plain_text).join("")
      : "";

  const orderProp = getProperty(page, "Order");
  const order =
    orderProp?.type === "number" ? orderProp.number ?? 99 : 99;

  const thumbProp = getProperty(page, "Thumbnail");
  let thumbnail: string | null = null;
  if (thumbProp?.type === "files" && thumbProp.files.length > 0) {
    const file = thumbProp.files[0];
    thumbnail =
      file.type === "external" ? file.external.url : file.file.url;
  }

  return { id: page.id, title, slug, year, description, order, thumbnail };
}

export async function getProjects(): Promise<Project[]> {
  if (!PROJECTS_DB_ID) return [];

  try {
    const response = await notion.dataSources.query({
      data_source_id: PROJECTS_DB_ID,
      filter: {
        and: [
          { property: "Published", checkbox: { equals: true } },
        ],
      },
      sorts: [{ property: "Order", direction: "ascending" }],
    });

    return response.results
      .filter(
        (page): page is PageObjectResponse =>
          "properties" in page && page.object === "page"
      )
      .map(extractProject);
  } catch {
    console.error("Failed to fetch projects from Notion");
    return [];
  }
}

export async function getProjectBySlug(
  slug: string
): Promise<Project | null> {
  if (!PROJECTS_DB_ID) return null;

  try {
    const response = await notion.dataSources.query({
      data_source_id: PROJECTS_DB_ID,
      filter: {
        and: [
          { property: "Slug", rich_text: { equals: slug } },
          { property: "Published", checkbox: { equals: true } },
        ],
      },
    });

    const page = response.results[0];
    if (!page || !("properties" in page) || page.object !== "page") return null;

    return extractProject(page as PageObjectResponse);
  } catch {
    return null;
  }
}

export async function getProjectBlocks(
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

export async function getNextProject(
  slug: string
): Promise<Project | null> {
  const projects = await getProjects();
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1 || index === projects.length - 1) return null;
  return projects[index + 1];
}
