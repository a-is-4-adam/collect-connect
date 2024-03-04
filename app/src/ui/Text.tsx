import { PropsWithChildren } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

const textVariants = cva("", {
  variants: {
    size: {
      "heading-sm": "text-heading-sm",
      "heading-xs": "text-heading-xs",
      "text-lg": "text-lg",
      "text-md": "text-md",
    },
    weight: {
      semibold: "font-semibold",
      medium: "font-medium",
      regular: "font-regular",
    },
    align: {
      left: "",
      center: "text-center",
    },
  },
  defaultVariants: {
    size: "text-md",
    weight: "regular",
    align: "left",
  },
});

type TextProps = {
  asChild?: boolean;
  className?: string;
} & VariantProps<typeof textVariants>;

export function Text({
  children,
  asChild,
  size,
  weight,
  className = "",
  align,
}: PropsWithChildren<TextProps>) {
  const Comp = asChild ? Slot : "p";

  return (
    <Comp className={textVariants({ size, weight, align, className })}>
      {children}
    </Comp>
  );
}
