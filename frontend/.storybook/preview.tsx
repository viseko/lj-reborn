import "../src/shared/styles/globals.scss";
import type { Decorator, Preview } from "@storybook/nextjs-vite";

export const globalTypes = {
  theme: {
    description: "Цветовая схема",
    toolbar: {
      title: "Тема",
      icon: "circlehollow",
      items: [
        { value: "light", title: "Светлая" },
        { value: "dark", title: "Тёмная" },
      ],
      dynamicTitle: true,
    },
  },
};

const withTheme: Decorator = (Story, context) => {
  document.documentElement.setAttribute("data-theme", context.globals.theme);
  return <Story />;
};

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "todo",
    },
  },
};

export const initialGlobals = {
  theme: "light",
};

export const decorators = [withTheme];
export default preview;
