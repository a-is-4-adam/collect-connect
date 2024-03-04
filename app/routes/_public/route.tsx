import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { Logo } from "./components/Logo";
import { NavLink } from "./components/NavLink";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import { createServerClient } from "@supabase/ssr";
import { createSupabaseClient } from "~/src/modules/database/client";

export async function loader({ request }: LoaderFunctionArgs) {
  const { supabaseClient } = createSupabaseClient(request);

  const { data, error } = await supabaseClient.auth.getSession();

  if (error) {
    return json({
      hasSession: false,
    });
  }

  return json({
    hasSession: Boolean(data.session),
  });
}

export default function Index() {
  const { hasSession } = useLoaderData<typeof loader>();

  return (
    <>
      <header className="py-4 border-b border-gray-100">
        <div className="container-2xl mx-auto px-6 flex items-center">
          <nav>
            <ul className="flex gap-6">
              <li className="px-2">
                <Link to="/">
                  <Logo />
                </Link>
              </li>
              <li className="flex items-end -translate-y-0.5">
                <NavLink to="/">Home</NavLink>
              </li>
              <li className="flex items-end -translate-y-0.5">
                <NavLink to="/shop">Shop</NavLink>
              </li>
            </ul>
          </nav>
          {hasSession ? (
            <Link
              to="dashboard"
              className="ml-auto bg-primary px-4 py-1 rounded-lg text-white text-sm  block"
            >
              Dashboard
            </Link>
          ) : (
            <ul className="flex gap-3 ml-auto">
              <li>
                <Link
                  to="/sign-in"
                  className="px-[18px] py-[10px] text-gray-600 font-medium block"
                >
                  Sign in
                </Link>
              </li>
              <li>
                <Link
                  to="sign-up"
                  className="bg-primary px-[18px] py-[10px] rounded-lg text-white font-medium block"
                >
                  Sign Up
                </Link>
              </li>
            </ul>
          )}
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </>
  );
}
