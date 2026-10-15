import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const dmSans = localFont({
  src: "./fonts/dm-sans-latin.woff2",
  weight: "400 700",
  style: "normal",
  display: "swap",
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  title: "GINGGA | More sales from the leads you already have",
  description:
    "AI agents that respond, qualify and follow up, so you can focus on closing. Set up, managed and continuously improved by GINGGA.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={dmSans.variable}>
      <body id="top">{children}</body>
    </html>
  );
}
