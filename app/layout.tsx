import type { Metadata, Viewport } from "next";
import { Nunito, Pixelify_Sans } from "next/font/google";
import BottomNav from "./components/BottomNav";
import SyncStarter from "./components/SyncStarter";
import "./globals.css";

const nunito = Nunito({ subsets: ["latin", "latin-ext"], variable: "--font-nunito" });
const pixelify = Pixelify_Sans({ subsets: ["latin"], variable: "--font-pixelify" });

export const metadata: Metadata = {
  title: "Petit Français",
  description: "日常与 DELF A1 法语学习",
};

export const viewport: Viewport = { themeColor: "#fbf7ef", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh">
      <body className={`${nunito.variable} ${pixelify.variable} font-sans antialiased`}>
        <main className="mx-auto max-w-xl px-4 pb-8 pt-6">{children}</main>
        <footer className="mx-auto max-w-xl px-4 pb-28 text-center text-xs leading-6 text-muted">
          © 2026 Alice Yu (JIATIAN YU). All rights reserved.
          <br />
          <a className="underline" href="https://lalalaoooyu.github.io/alice-intro/" target="_blank" rel="noopener">Portfolio</a>
          {" · "}
          <a className="underline" href="https://github.com/lalalaoooyu" target="_blank" rel="noopener">GitHub</a>
          {" · "}
          <a className="underline" href="https://www.linkedin.com/in/jiatian-yu-7223b9232/" target="_blank" rel="noopener">LinkedIn</a>
        </footer>
        <BottomNav />
        <SyncStarter />
      </body>
    </html>
  );
}
