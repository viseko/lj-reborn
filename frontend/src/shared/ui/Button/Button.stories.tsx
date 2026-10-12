import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button } from "./Button";

const meta: Meta<typeof Button> = {
  title: "shared/ui/Button",
  component: Button,
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    disabled: false,
    variant: "primary",
    children: "Сохранить",
  },
};

export const Secondary: Story = {
  args: {
    disabled: false,
    variant: "secondary",
    children: "Отмена",
  },
};

export const DisabledPrimary: Story = {
  args: { variant: "primary", children: "Сохранить", disabled: true },
};

export const DisabledSecondary: Story = {
  args: { variant: "secondary", children: "Отмена", disabled: true },
};
