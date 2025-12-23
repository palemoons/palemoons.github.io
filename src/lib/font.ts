import { Noto_Sans_Mono, Noto_Serif_SC } from "next/font/google";

export const textFont = Noto_Serif_SC({
  subsets: ["latin"],
  weight: ["200", "400", "600"],
  fallback: ["Noto Serif CJK SC", "Source Han Serif SC", "Songti SC", "STSong", "SimSun", "serif"],
  variable: "--font-text",
  display: "swap",
});

export const codeFont = Noto_Sans_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  fallback: [
    "Noto Sans Mono",
    "SFMono-Regular",
    "Menlo",
    "Consolas",
    "Noto Serif CJK SC",
    "Source Han Serif SC",
    "Songti SC",
    "STSong",
    "SimSun",
    "monospace",
  ],
  variable: "--font-code",
  display: "swap",
});
