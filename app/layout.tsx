import type { Metadata } from "next";
import localFont from "next/font/local";
import Header from "@/lib/components/Header";
import "./globals.css";
import Footer from "@/lib/components/Home/Footer";

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
      <Header />
        <div className="col-start-1 col-span-full row-start-1 min-h-full">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
