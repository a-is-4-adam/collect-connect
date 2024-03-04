import { NavLink as RemixNavLink, NavLinkProps } from "@remix-run/react";
export function NavLink(props: NavLinkProps) {
  return (
    <RemixNavLink
      className={({ isActive }) =>
        `${isActive ? "text-primary" : "text-gray-600"} font-medium`
      }
      {...props}
    />
  );
}
