import { ComponentProps } from "react";
import { Text } from "./Text";
export function Label(props: ComponentProps<"label">) {
  return (
    <Text asChild className="text-gray-700">
      <label {...props} />
    </Text>
  );
}
