import { SupabaseClient } from "./client";
import { User } from "@supabase/supabase-js";

export async function getStoreBySlug(client: SupabaseClient, user: User) {
  const { data, error } = await client
    .from("store_profile")
    .select(
      `
      store (id, slug, display_name)
    `
    )
    .eq("user_id", user.id)
    .single();

  if (error) {
    throw new Response(error.message);
  }

  if (!data?.store) {
    throw new Response(
      "The store either does not exist or you do not have access to view the store",
      { status: 401 }
    );
  }

  return data.store;
}
