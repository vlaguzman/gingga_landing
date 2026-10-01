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
  title: "GINGGA — Turn more leads into customers",
  description:
    "GINGGA builds and operates AI-powered sales systems that qualify leads, automate follow-up and help your sales team close more of the demand you already have.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={dmSans.variable}>
      <body id="top">{children}</body>
    </html>
  );
}
