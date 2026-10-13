import type { Meta, StoryObj } from "@storybook/react-vite";

import { GradientCard } from ".";

const meta = {
  title: "Components/GradientCard",
  component: GradientCard,
  args: {},
} satisfies Meta<typeof GradientCard>;

const Default: StoryObj<typeof meta> = {};

export { Default };
export default meta;
