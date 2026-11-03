import type { Metadata } from "next";
import localFont from "next/font/local";
import Header from "@/lib/components/Header";
import IntroLoader from "@/lib/components/IntroLoader";
import SmoothScroll from "@/lib/components/SmoothScroll";
import Footer from "@/lib/components/Home/Footer";
import "./globals.css";

const melodrama = localFont({
  src: "./fonts/Melodrama-Variable.woff2",
  variable: "--font-melodrama",
  weight: "300 700",
  display: "swap",
  adjustFontFallback: "Times New Roman",
  fallback: ["Times New Roman", "serif"],
});

const generalSans = localFont({
  src: "./fonts/GeneralSans-Variable.woff2",
  variable: "--font-general-sans",
  weight: "200 700",
  display: "swap",
  fallback: ["Arial", "sans-serif"],
});

export const metadata: Metadata = {
  title: "VORTE",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${melodrama.variable} ${generalSans.variable} h-full antialiased`}
    >
      <body className="grid grid-cols-12 min-h-full">
        <SmoothScroll />
        <IntroLoader />
        <Header />
        <div className="col-start-1 col-span-full row-start-1 min-h-full isolate">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
