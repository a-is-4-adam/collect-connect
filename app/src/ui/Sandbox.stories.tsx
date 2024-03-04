import type { Meta, StoryObj } from "@storybook/react";
import { PropsWithChildren } from "react";
import { createRemixStub } from "@remix-run/testing";
import { Text } from "./Text";
import { Stack } from "./Stack";
import { Label } from "./Label";
import { Link } from "./Link";
import { InputGroup } from "./InputGroup";
import { Input } from "./Input";
import { Button } from "./Button";
import logoMark from "../../assets/logoMark.svg";
import logo from "../../assets/logo.svg";
import { Form, NavLink as RemixNavLink, NavLinkProps } from "@remix-run/react";

import { cn } from "./utils";

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

function DashboardLayout() {
  return (
    <div className="min-h-screen flex">
      <Stack
        space="20"
        className="w-[280px] shrink-0 border-r border-gray-300 py-16 shadow-xl"
      >
        <img alt="" src={logo} className="h-[50px]" />
        <nav className="grow pl-12">
          <ul>
            <li>
              <NavLink to="/">Home</NavLink>
            </li>
            <li>
              <NavLink to="/dashboard">Dashboard</NavLink>
            </li>
            <li>
              <NavLink to="/stores">Stores</NavLink>
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

      <main className="bg-gray-50 w-full"></main>
    </div>
  );
}

const RemixStub = createRemixStub([
  {
    path: "/",
    Component: DashboardLayout,
  },
]);

const meta = {
  title: "ui/Sandbox",
  component: RemixStub,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof RemixStub>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SignInPage: Story = {};
