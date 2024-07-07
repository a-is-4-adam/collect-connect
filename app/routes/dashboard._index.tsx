import { Link as RemixLink, useLoaderData } from "@remix-run/react";
import { Stack } from "~/ui/Stack";
import { Text } from "~/ui/Text";
import { ChevronRight } from "lucide-react";
import { Link } from "~/ui/Link";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import { createSupabaseClient } from "~/src/modules/database/client";
import { getUser } from "~/src/modules/database/getUser";

export async function loader({ request }: LoaderFunctionArgs) {
  const { supabaseClient } = createSupabaseClient(request);
  const user = await getUser(supabaseClient);

  const { data: store } = await supabaseClient
    .from("store_profile")
    .select(
      `
        store (id, slug, display_name)
      `
    )
    .eq("user_id", user.id)
    .single();

  if (!store) {
    throw Error("No store created for user");
  }

  return json(store);
}

export default function DashboardIndex() {
  const stores = useLoaderData<typeof loader>();

  return (
    <>
      <Stack space="56">
        <div>
          <Text
            asChild
            size="heading-sm"
            weight="semibold"
            className="text-gray-900"
          >
            <h2>Welcome back, Adam</h2>
          </Text>
          <Text className="text-gray-600">
            Manage your stores and inventory
          </Text>
        </div>

        <div className="flex gap-16">
          {stores.map(({ store }) =>
            store ? (
              <div
                key={store?.id}
                className=" flex flex-col basis-1/2  rounded-8 border border-gray-300  shadow-sm  "
              >
                <RemixLink
                  to={`store/${store.slug}`}
                  className="bg-white grow p-20 pb-[40px] rounded-t-8 transition-all  hover:pr-16 hover:text-brand-700"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <Text size="text-lg">{store.display_name}</Text>
                      <Text size="text-md" className="text-gray-600">
                        au.collect-connect.com/store/{store.slug}
                      </Text>
                    </div>
                    <ChevronRight size={18} />
                  </div>
                </RemixLink>
                <div className="px-20   bg-white rounded-b-8 mt-auto">
                  <div className="flex gap-16 justify-end pb-20 pt-32">
                    <Link
                      to={`http://au.collect-connect.com/store/${store.slug}`}
                      className="px-32 border-2 border-brand-300 rounded-8 py-6 transition-colors text-brand-600 hover:bg-brand-100 hover:border-brand-100"
                    >
                      View
                    </Link>
                    <Link
                      to={`store/${store.slug}`}
                      className="px-32 bg-brand-50 rounded-4 py-6 transition-colors text-brand-600 hover:bg-brand-100"
                    >
                      Manage
                    </Link>
                  </div>
                </div>
              </div>
            ) : null
          )}
        </div>
      </Stack>
    </>
  );
}
