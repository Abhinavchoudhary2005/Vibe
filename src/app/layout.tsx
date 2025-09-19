import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { TRPCReactProvider } from "@/trpc/client";
import { Toaster } from "sonner";
import { ThemeProvider } from "next-themes";
import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SiteForge - Website Builder",
  description: "Easily create, customize, and launch your websites.",
  metadataBase: new URL("https://site-forge-gamma.vercel.app"),

  openGraph: {
    type: "website",
    url: "https://site-forge-gamma.vercel.app",
    title: "SiteForge - Website Builder",
    description: "Easily create, customize, and launch your websites.",
    images: [
      {
        url: "/preview.png",
        width: 1200,
        height: 627,
        alt: "SiteForge Preview",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "SiteForge - Website Builder",
    description: "Easily create, customize, and launch your websites.",
    images: ["/preview.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#6366f1",
        },
      }}
    >
      <TRPCReactProvider>
        <html lang="en" suppressHydrationWarning>
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          >
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
              <Analytics />
              <Toaster />
            </ThemeProvider>
          </body>
        </html>
      </TRPCReactProvider>
    </ClerkProvider>
  );
}
