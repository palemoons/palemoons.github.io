"use client";

import { ThemeProvider } from "next-themes";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./global.css";

// Static export
export const dynamic = "error";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body>
        <ThemeProvider defaultTheme="system">
          <Navbar />
          <main className="main container">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;
