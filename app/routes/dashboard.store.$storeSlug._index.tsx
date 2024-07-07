import { LoaderFunctionArgs, redirect, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { createSupabaseClient } from "~/src/modules/database/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/ui/Table";
import { z } from "zod";
import { Link } from "~/ui/Link";
import { Stack } from "~/ui/Stack";

const inventoryItemTagsSchema = z.object({
  price: z.string(),
  quality: z.enum(["mint", "near-mint"]),
});

const itemTagsSchema = z.object({
  name: z.string(),
});

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { storeSlug } = params;

  if (!storeSlug) {
    return redirect("/dashboard");
  }

  const { supabaseClient } = createSupabaseClient(request);
  const { data } = await supabaseClient.auth.getSession();

  if (data.session) {
    const { data: stores } = await supabaseClient
      .from("store_profile")
      .select(
        `
            store (inventory_item(id, status, tags, store_id, item(tags)))
        `
      )
      .eq("store.slug", storeSlug);

    const firstStore = stores?.[0].store;

    if (!firstStore) {
      throw Error("No store created for user");
    }

    const formattedFirstStore = {
      inventoryItems: firstStore.inventory_item.map((inventoryItem) => ({
        id: inventoryItem.id,
        status: inventoryItem.status,
        tags: inventoryItemTagsSchema.parse(inventoryItem.tags),
        name: itemTagsSchema.parse(inventoryItem.item?.tags).name,
      })),
    };

    return json(formattedFirstStore);
  }
  throw new Response(null, { status: 401 });
}

export default function DashboardStoreIndex() {
  const { inventoryItems } = useLoaderData<typeof loader>();

  return (
    <Stack space="32">
      <div className="flex justify-end">
        <Link
          className="px-32 bg-brand-100 rounded-4 py-6 transition-colors text-brand-600 hover:bg-brand-200"
          to="inventory/new"
        >
          New
        </Link>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Quality</TableHead>
            <TableHead>Status</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {inventoryItems?.map((inventoryItem) => (
            <TableRow key={inventoryItem.id}>
              <TableCell>{inventoryItem.name}</TableCell>
              <TableCell>{inventoryItem.tags.price}</TableCell>
              <TableCell>{inventoryItem.tags.quality}</TableCell>
              <TableCell>{inventoryItem.status}</TableCell>
              <TableCell className="text-right">
                <Link to={`inventory/${inventoryItem.id}`}>Edit</Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Stack>
  );
}
