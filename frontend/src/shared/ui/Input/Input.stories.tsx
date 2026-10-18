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
    placeholder: "name@example.com",
    type: "email",
  },
};

export const WithError: Story = {
  args: {
    label: "Email",
    placeholder: "name@example.com",
    defaultValue: ":D",
    error: "Введите корректный email",
  },
};

export const WithoutLabel: Story = {
  args: { "aria-label": "Поиск", placeholder: "Поиск по записям" },
};

export const Disabled: Story = {
  args: {
    label: "Email",
    placeholder: "name@example.com",
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
