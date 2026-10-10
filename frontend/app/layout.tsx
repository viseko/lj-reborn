import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LJ Reborn",
  description: "Блог в духе ЖЖ",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
