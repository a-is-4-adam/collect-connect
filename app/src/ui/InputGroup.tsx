import { PropsWithChildren } from "react";
import { Stack } from "./Stack";

export function InputGroup({ children }: PropsWithChildren) {
  return <Stack space="6">{children}</Stack>;
}
