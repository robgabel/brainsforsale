import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "BrainsFor.Dev — Load a genius into your AI",
  description:
    "Knowledge graphs of the world's best thinkers, packaged as 8 AI skills you actually use. Think better in seconds.",
  openGraph: {
    title: "BrainsFor.Dev — Load a genius into your AI",
    description:
      "Knowledge graphs of the world's best thinkers, packaged as 8 AI skills you actually use.",
    siteName: "BrainsFor.Dev",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} antialiased`}
    >
      <body className="bg-background text-foreground">
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
