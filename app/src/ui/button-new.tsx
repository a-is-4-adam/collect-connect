import { ComponentProps } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Text } from "./Text";
const buttonVariants = cva(
  "rounded-8 outline-none ring-offset-2 focus:ring-2 ring-brand-300",
  {
    variants: {
      variant: {
        default: "text-white bg-brand-600 hover:bg-brand-700",
      },
      size: {
        lg: "px-20 py-12",
      },
      width: {
        content: "",
        full: "w-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "lg",
      width: "content",
    },
  }
);

type ButtonProps = ComponentProps<"button"> &
  VariantProps<typeof buttonVariants>;

export function Button({ variant, size, width, ...props }: ButtonProps) {
  return (
    <Text asChild weight="semibold" size="text-md">
      <button className={buttonVariants({ variant, size, width })} {...props} />
    </Text>
  );
}
