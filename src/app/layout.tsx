import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/context/providers";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Social Media App",
  description: "Social Media App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}
