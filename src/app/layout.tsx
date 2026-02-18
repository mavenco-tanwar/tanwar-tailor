import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.tanwartailor.com"),
  title: "Tanwar Tailor | Ladies & Gents Alteration Specialist",
  description: "Expert tailoring services in Sikar. Specialists in shirt, pant, suit, bridal dresses, and custom stitching for men and women.",
  icons: {
    icon: "/images/favicon-logo.png",
    apple: "/images/favicon-logo.png",
  },
  openGraph: {
    title: "Tanwar Tailor | Ladies & Gents Alteration Specialist",
    description: "Expert tailoring services in Sikar. Specialists in shirt, pant, suit, bridal dresses, and custom stitching for men and women.",
    images: ["/images/favicon-logo.png"],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/images/favicon-logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.variable} ${playfair.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
