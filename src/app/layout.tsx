import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/components/shared/Providers";
import { Navbar } from "@/components/shared/Navbar";
import { ColorModeScript } from "@chakra-ui/react";
import { chakraThemeConfig } from "@/consts/chakra-theme";

export const metadata: Metadata = {
  title: "Marketplace",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ backgroundColor: "black", paddingBottom: "100px" }}>
        <ColorModeScript
          initialColorMode={
            chakraThemeConfig.initialColorMode as "dark" | "light"
          }
        />
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
