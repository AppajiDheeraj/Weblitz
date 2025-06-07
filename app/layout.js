import { ConvexClientProvider } from "./ConvexClientProvider";
import "./globals.css";
import Provider from "./provider";
import { Toaster } from "@/components/ui/sonner";

export const metadata = {
  title: "bolt.new",
  description: "Websites to create Websites",
  icons: {
    icon: "/logo.png", // or .png, .svg, etc.
  },
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
