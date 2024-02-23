import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { createSupabaseClient } from "~/src/modules/database/client";

export async function loader({ request }: LoaderFunctionArgs) {
  const { supabaseClient } = createSupabaseClient(request);

  const { data } = await supabaseClient.auth.getSession();

  if (!data.session) {
    redirect("/sign-in");
  }

  return null;
}

export default function Organisation() {
  return <Outlet />;
}
