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

export const PrimaryLink: Story = {
  args: {
    variant: "primary",
    children: "Сохранить",
    href: "#",
  },
};

export const Secondary: Story = {
  args: {
    disabled: false,
    variant: "secondary",
    children: "Отмена",
  },
};

export const SecondaryLink: Story = {
  args: {
    href: "#",
    variant: "secondary",
    children: "Отмена",
  },
};

export const Ghost: Story = {
  args: { variant: "ghost", children: "Сохранить", disabled: false },
};

export const DisabledPrimary: Story = {
  args: { variant: "primary", children: "Сохранить", disabled: true },
};

export const DisabledSecondary: Story = {
  args: { variant: "secondary", children: "Отмена", disabled: true },
};

export const DisabledGhost: Story = {
  args: { variant: "ghost", children: "Сохранить", disabled: true },
};
