import { ComponentProps } from "react";
import { Text } from "./Text";
export function Label(props: ComponentProps<"label">) {
  return (
    <Text asChild weight="medium" className="text-gray-700 block">
      <label {...props} />
    </Text>
  );
}
