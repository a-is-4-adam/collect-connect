import {
  Form,
  NavLink as RemixNavLink,
  NavLinkProps,
  Outlet,
} from "@remix-run/react";
import { Button } from "~/ui/Button";
import { Stack } from "~/ui/Stack";
import { cn } from "~/ui/utils";
import logo from "../assets/logo.svg";
import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { createSupabaseClient } from "~/src/modules/database/client";
export async function loader({ request }: LoaderFunctionArgs) {
  const { supabaseClient } = createSupabaseClient(request);

  const { data } = await supabaseClient.auth.getSession();

  if (!data.session) {
    redirect("/sign-in");
  }

  return null;
}

function NavLink({ className, ...props }: NavLinkProps) {
  return (
    <RemixNavLink
      className={({ isActive }) => {
        return cn(
          "px-32 py-12 block transition-colors font-medium rounded-tl-8 rounded-bl-8 text-md ",
          className,
          {
            "bg-brand-100 color-brand-700 border-r-4 border-brand-300":
              isActive,
            "hover:bg-brand-50 hover:color-brand-700": !isActive,
          }
        );
      }}
      {...props}
    />
  );
}

export default function DashboardLayout() {
  return (
    <div className="min-h-screen flex">
      <div className="flex w-[280px] shrink-0 border-r border-gray-300 py-16 shadow-xl z-10">
        <Stack space="20">
          <img alt="" src={logo} className="h-[58px]" />
          <nav className="grow pl-12">
            <ul>
              <li>
                <NavLink to="/">Home</NavLink>
              </li>
              <li>
                <NavLink to="/dashboard" end>
                  Dashboard
                </NavLink>
              </li>
              <li>
                <NavLink to="/dashboard/stores">Stores</NavLink>
              </li>
            </ul>
          </nav>

          <Form method="post" action="/sign-out" className="pl-12">
            <Button
              variant="ghost"
              width="full"
              className="px-32 py-12 block transition-colors font-medium rounded-none rounded-tl-8 rounded-bl-8 text-md text-left hover:bg-brand-50 hover:color-brand-700"
            >
              Sign out
            </Button>
          </Form>
        </Stack>
      </div>

      <main className="bg-gray-50 w-full px-32 pt-16 pb-32">
        <Outlet />
      </main>
    </div>
  );
}
