import type { Metadata } from "next";
import "@/shared/styles/globals.scss";

import { Manrope } from "next/font/google";
import { SessionInit } from "@/entities/user";
import { Header } from "@/widgets/header";

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
    <html lang="ru" className={manrope.variable} suppressHydrationWarning>
      <head>
        <script src="/theme-init.js"></script>
      </head>
      <body>
        <SessionInit />
        <div className="page">
          <Header />
          <main className="page-main">{children}</main>
        </div>
      </body>
    </html>
  );
}
