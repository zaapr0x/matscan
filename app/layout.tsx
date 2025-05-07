import type { Metadata } from "next";
import { ThemeProvider } from "@/components/contexts/theme-provider";
import { Navbar } from "@/components/navbar";
import { Space_Mono, Space_Grotesk, Inter } from "next/font/google";
import "@/styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const sansFont = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
  weight: "400",
});

const monoFont = Space_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
  weight: "400",
});

export const metadata: Metadata = {
  title: "Matscan",
  description: "A MatsFi Transaction Explorer",
  viewport: "width=device-width, initial-scale=1",
  openGraph: {
    title: "Matscan",
    description: "A MatsFi Transaction Explorer",
    url: "https://matscan.xyz", // Replace with your actual site URL
    siteName: "Matscan",
    images: [
      {
        url: "/og-image.png", // Path to your OG image in /public or a full URL
        width: 1200,
        height: 630,
        alt: "Matscan - MatsFi Transaction Explorer",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Matscan",
    description: "A MatsFi Transaction Explorer",
    images: ["/og-image.png"], // Twitter-specific image
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          type="text/css"
          href="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css"
        />
      </head>
      <body
        className={`${sansFont.variable} ${monoFont.variable} ${inter.variable} font-regular antialiased tracking-wide dark`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <main className="sm:container mx-auto w-[95vw] h-auto scroll-smooth">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}