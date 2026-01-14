import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { codeFont, textFont } from "@/lib/font";
import { GoogleAnalytics } from "@next/third-parties/google";
import { ThemeProvider } from "next-themes";

import "./global.css";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html
      lang="zh-CN"
      suppressHydrationWarning
      className={`${textFont.variable} ${codeFont.variable} ${textFont.className}`}
    >
      <body className="flex min-h-screen flex-col">
        <ThemeProvider defaultTheme="system">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
      <GoogleAnalytics gaId="G-2B1J5RE75M" />
    </html>
  );
};

export default RootLayout;
