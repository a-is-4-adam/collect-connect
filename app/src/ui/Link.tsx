import { Link as RemixLink, LinkProps } from "@remix-run/react";

export function Link(props: LinkProps) {
  return <RemixLink className="text-brand-700 " {...props} />;
}
