import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { createSupabaseClient } from "~/src/modules/database/client";

export async function action({ request }: ActionFunctionArgs) {
  const { supabaseClient, headers } = createSupabaseClient(request);

  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const redirectURI = searchParams.get("redirect_uri") ?? "/";

  await supabaseClient.auth.signOut();

  return redirect(redirectURI, {
    headers,
  });
}
