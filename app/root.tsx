import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import {
  Form,
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  json,
  useLoaderData,
} from "@remix-run/react";
import stylesheet from "./tailwind.css";
import { createSupabaseClient } from "./src/modules/database/client";
import { Button } from "~/ui/button";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
];

export async function loader({ request }: LoaderFunctionArgs) {
  const { supabaseClient } = createSupabaseClient(request);

  const { data } = await supabaseClient.auth.getSession();

  return json({
    user: Boolean(data.session),
  });
}

export default function App() {
  const data = useLoaderData<typeof loader>();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <header className="border-b border-gray-100 py-2 flex justify-center">
          <Link to="/" className="font-bold text-xl">
            Collect Connect
          </Link>
          <nav className="max-w-7xl w-full flex justify-end">
            <ul>
              <li>
                {data.user ? (
                  <Form method="post" action="/sign-out">
                    <Button
                      variant="link"
                      className="font-semibold text-blue-600"
                    >
                      Sign out
                    </Button>
                  </Form>
                ) : (
                  <ul className="flex divide-x border-solid divide-gray-400">
                    <li className="pr-2">
                      <Link
                        className="font-semibold text-blue-600"
                        to="/sign-in"
                      >
                        Sign in
                      </Link>
                    </li>
                    <li className="pl-2">
                      <Link
                        className="font-semibold text-blue-600"
                        to="/sign-up"
                      >
                        Sign up
                      </Link>
                    </li>
                  </ul>
                )}
              </li>
            </ul>
          </nav>
        </header>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
