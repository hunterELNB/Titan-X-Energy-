import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Titan X Energy",
  description:
    "Modular energy solutions for a changing world — modular refining, natural gas, LNG equipment, and digital operational technologies."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
