import { ConvexClientProvider } from "./ConvexClientProvider";
import "./globals.css";
import Provider from "./provider";
import { Toaster } from "@/components/ui/sonner";

export const metadata = {
  title: "Weblitz – Websites to Create Websites",
  description:
    "Weblitz is your all-in-one AI-powered platform to create, customize, and deploy stunning websites instantly. From code to canvas – build smarter, faster, and better.",
  keywords: [
    "AI website builder",
    "Weblitz",
    "create websites online",
    "website generator",
    "no-code website builder",
    "AI developer tools",
    "instant websites",
    "startup landing pages",
  ],
  authors: [
    { name: "Dheeraj Appaji", url: "https://github.com/AppajiDheeraj" },
  ],
  creator: "Weblitz Team",
  publisher: "Weblitz",
  metadataBase: new URL("https://weblitz.vercel.app"),
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Weblitz – Websites to Create Websites",
    description:
      "Build production-ready websites in seconds using AI. Weblitz helps you turn ideas into fully responsive web experiences.",
    url: "https://weblitz.vercel.app",
    siteName: "Weblitz",
    images: [
      {
        url: "/logo.png", // place this in /public
        width: 600,
        height: 600,
        alt: "Weblitz – AI Website Builder",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  category: "technology",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ConvexClientProvider>
          <Provider>
            {children}
            <Toaster />
          </Provider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
