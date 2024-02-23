import { LoaderFunctionArgs, json } from "@remix-run/node";
import { Outlet, useLoaderData, useOutletContext } from "@remix-run/react";
import { getOrganisationBySlug } from "~/src/modules/database/getOrganisationBySlug";

type ContextType = Awaited<
  ReturnType<typeof getOrganisationBySlug>
>["organisation"];

export async function loader(args: LoaderFunctionArgs) {
  const data = await getOrganisationBySlug(args);

  return json(data);
}

export default function Organisation() {
  const { organisation } = useLoaderData<typeof loader>();

  return (
    <section>
      <h1>{organisation?.display_name}</h1>
      <Outlet context={organisation satisfies ContextType} />
    </section>
  );
}

export function useOrganisation() {
  return useOutletContext<ContextType>();
}
