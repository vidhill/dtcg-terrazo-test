import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from ".";

const meta = {
  title: "Components/Button",
  component: Button,
  args: {
    children: "Hello World",
  },
} satisfies Meta<typeof Button>;

const Default: StoryObj<typeof meta> = {};

export { Default };
export default meta;
