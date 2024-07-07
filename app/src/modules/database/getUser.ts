import { redirect } from "@remix-run/node";
import { SupabaseClient } from "./client";

export async function getUser(client: SupabaseClient) {
  const { data, error } = await client.auth.getUser();

  if (error || !data.user) {
    throw redirect("/login", { status: 401 });
  }

  return data.user;
}
