import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { getSiteUrl } from "@/lib/env.server";
import { codeFont, textFont } from "@/lib/font";
import { GoogleAnalytics } from "@next/third-parties/google";
import { ThemeProvider } from "next-themes";

import "./global.css";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  const siteUrl = getSiteUrl();
  const buildDate = new Date().toISOString().split("T")[0];

  return (
    <html
      lang="zh-CN"
      suppressHydrationWarning
      className={`${textFont.variable} ${codeFont.variable} ${textFont.className}`}
      data-scroll-behavior="smooth"
    >
      <body className="flex min-h-screen flex-col">
        <ThemeProvider defaultTheme="system">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer siteUrl={siteUrl} buildDate={buildDate} />
        </ThemeProvider>
      </body>
      <GoogleAnalytics gaId="G-2B1J5RE75M" />
    </html>
  );
};

export default RootLayout;
