import { PropsWithChildren } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

const stackVariants = cva("flex flex-col w-full", {
  variants: {
    space: {
      "6": "space-y-6",
      "12": "space-y-12",
      "20": "space-y-20",
      "24": "space-y-24",
      "32": "space-y-32",
      "56": "space-y-56",
    },
    alignHorizontal: {
      left: "items-start",
      center: "items-center",
    },
  },
  defaultVariants: {
    space: "12",
  },
});

type StackProps = {
  asChild?: boolean;
  className?: string;
} & VariantProps<typeof stackVariants>;

export function Stack({
  children,
  asChild,
  space,
  alignHorizontal,
  className,
}: PropsWithChildren<StackProps>) {
  const Comp = asChild ? Slot : "div";

  return (
    <Comp className={stackVariants({ space, alignHorizontal, className })}>
      {children}
    </Comp>
  );
}
