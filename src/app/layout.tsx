import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "TatkalEase | Independent Prototype",
  description: "A mock train-booking experience created for a hackathon.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
