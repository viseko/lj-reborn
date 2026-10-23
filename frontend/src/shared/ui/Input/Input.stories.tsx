import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Input } from "./Input";

const meta: Meta<typeof Input> = {
  title: "shared/ui/Input",
  component: Input,
};

export default meta;

type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    label: "Email",
    type: "email",
  },
};

export const WithError: Story = {
  args: {
    label: "Email",
    defaultValue: ":D",
    error: "Введите корректный email",
  },
};

export const Disabled: Story = {
  args: {
    label: "Email",
    type: "email",
    disabled: true,
  },
};

export const Password: Story = {
  args: {
    label: "Пароль",
    type: "password",
  },
};
