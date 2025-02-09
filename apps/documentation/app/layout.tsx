import "./global.css";
import { RootProvider } from "fumadocs-ui/provider";
import { Inter, JetBrains_Mono, Montserrat } from "next/font/google";
import type { ReactNode } from "react";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  adjustFontFallback: true,
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} ${montserrat.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className="flex flex-col min-h-screen font-sans [&_pre]:font-mono [&_code]:font-mono">
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
