import { SupabaseClient } from "./client";
import { z } from "zod";

const tagsSchema = z.object({
  name: z.string(),
});

export async function getItems(client: SupabaseClient) {
  const { data: items, error } = await client.from("item").select();

  if (error) {
    throw new Response("Unable to fetch items", { status: 500 });
  }

  const parsedRows = items.map((item) => ({
    ...item,
    tags: tagsSchema.parse(item.tags),
  }));

  return parsedRows;
}
