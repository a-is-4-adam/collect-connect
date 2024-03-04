import type { Meta, StoryObj } from "@storybook/react";

import { Text } from "./Text";

const meta = {
  title: "ui/Text",
  component: Text,
  args: {
    children: "The quick brown fox",
  },
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

export const HeadingSm: Story = {
  args: {
    size: "heading-sm",
    weight: "semibold",
  },
};
