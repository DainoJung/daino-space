import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dain — Builder's Space",
  description: "A builder crafting digital experiences.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
