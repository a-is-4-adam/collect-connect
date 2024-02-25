import { ComponentProps } from "react";

export function Input(props: ComponentProps<"input">) {
  return (
    <input
      className="rounded-8 border border-gray-300 block w-full px-12 py-8"
      {...props}
    />
  );
}
