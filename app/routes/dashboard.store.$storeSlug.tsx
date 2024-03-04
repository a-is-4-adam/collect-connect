import { Outlet, useLoaderData, useOutletContext } from "@remix-run/react";
import { Stack } from "~/ui/Stack";
import { Text } from "~/ui/Text";
import { Link } from "~/ui/Link";
import { LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { createSupabaseClient } from "~/src/modules/database/client";
import { Tables } from "~/src/modules/database/types";

type CurrentStore = Pick<
  Tables<"store">,
  "display_name" | "id" | "slug" | "contact_link"
>;

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
          store (id, slug, display_name, contact_link)
        `
      )
      .eq("user_id", data.session.user.id)
      .eq("store.slug", storeSlug);

    if (!stores || !stores.length) {
      throw Error("No store created for user");
    }

    return json(stores[0].store);
  }
  throw new Response(null, { status: 401 });
}

export default function DashboardStore() {
  const store = useLoaderData<typeof loader>();

  if (!store) {
    throw new Error("Store not found");
  }

  return (
    <>
      <Stack space="56">
        <div>
          <div className=" flex gap-12 items-baseline">
            <Text
              asChild
              size="heading-sm"
              weight="semibold"
              className="text-gray-900"
            >
              <h2>{store.display_name}</h2>
            </Text>
            <Link to="edit">Edit</Link>
          </div>
          <Text className="text-gray-600">{store.slug}</Text>
        </div>
        <Outlet context={store satisfies CurrentStore} />
      </Stack>
    </>
  );
}

export function useCurrentStore() {
  return useOutletContext<CurrentStore>();
}
