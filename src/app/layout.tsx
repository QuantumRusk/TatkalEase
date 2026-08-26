import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TatkalEase",
  description: "A mock train-booking experience created for a hackathon.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
