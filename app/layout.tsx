import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Quinceañera María José • 15 Años",
  description: "Te invitamos a celebrar los 15 años de María José. Una noche mágica junto al mar.",
  openGraph: {
    title: "Quinceañera María José • 15 Años",
    description: "Te invitamos a celebrar los 15 años de María José.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className="min-h-full antialiased">{children}</body>
    </html>
  );
}
