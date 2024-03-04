import { LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { createSupabaseClient } from "./client";

export async function getStoreBySlug({ request, params }: LoaderFunctionArgs) {
  const { supabaseClient } = createSupabaseClient(request);

  const { data } = await supabaseClient.auth.getSession();

  if (!data.session) {
    throw json("User not logged in", { status: 401 });
  }

  const { slug } = params;

  if (!slug) {
    throw redirect("/dashboard");
  }

  const { data: stores, error } = await supabaseClient
    .from("store")
    .select("display_name, contact_link, store_profile(store_id, user_id)")
    .eq("slug", slug);

  if (error) {
    throw json(error.message, 500);
  }

  if (stores.length === 0) {
    throw new Response("Store not found", { status: 404 });
  }

  if (
    stores[0].store_profile.some(
      ({ user_id }) => user_id === data.session.user.id
    )
  ) {
    return {
      store: stores[0],
    };
  }

  throw json("Not allowed", { status: 401 });
}
