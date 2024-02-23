import { LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { createSupabaseClient } from "./client";

export async function getOrganisationBySlug({
  request,
  params,
}: LoaderFunctionArgs) {
  const { supabaseClient } = createSupabaseClient(request);

  const { data } = await supabaseClient.auth.getSession();

  if (!data.session) {
    throw json("User not logged in", { status: 401 });
  }

  const { slug } = params;

  if (!slug) {
    throw redirect("/organisation");
  }

  const { data: organisations, error } = await supabaseClient
    .from("organisation")
    .select(
      "display_name, contact_link, organisation_profile(organisation_id, user_id)"
    )
    .eq("slug", slug);

  if (error) {
    throw json(error.message, 500);
  }

  if (organisations.length === 0) {
    throw new Response("Organsation not found", { status: 404 });
  }

  if (
    organisations[0].organisation_profile.some(
      ({ user_id }) => user_id === data.session.user.id
    )
  ) {
    return {
      organisation: organisations[0],
    };
  }

  throw json("Not allowed", { status: 401 });
}
