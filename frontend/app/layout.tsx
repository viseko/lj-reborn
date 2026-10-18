import type { Metadata } from "next";
import { Manrope } from "next/font/google";

import { Header } from "@/widgets/header";

import "@/shared/styles/globals.scss";

export const metadata: Metadata = {
  title: "LJ Reborn",
  description: "Блог в духе ЖЖ",
};

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-manrope",
  display: "swap",
});

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ru"
      className={manrope.variable}
      suppressHydrationWarning
    >
      <head>
        <script src="/theme-init.js"></script>
      </head>
      <body>
        <div className="page">
          <Header />
          <main className="page-main">{children}</main>
        </div>
      </body>
    </html>
  );
}
