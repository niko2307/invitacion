import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Quinceañera Maria Jose  • 15 Años",
  description: "Te invitamos a celebrar los 15 años de Maria Jose. Una noche mágica junto al mar.",
  openGraph: {
    title: "Quinceañera Maria Jose  • 15 Años",
    description: "Te invitamos a celebrar los 15 años de Maria Jose.",
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
