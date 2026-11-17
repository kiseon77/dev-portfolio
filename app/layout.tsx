import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";

const suit = localFont({
  src: "./fonts/SUIT-Variable.woff2",
  weight: "100 900",
  display: "swap",
  variable: "--font-suit",
});

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://dev-protfoil.vercel.app";

const TITLE = "개발자 한기선";
const DESCRIPTION =
  "기획과 디자인의 언어를 개발 언어로 옮기는 프론트엔드 개발자 한기선의 포트폴리오입니다. React, TypeScript, 디자인 시스템, AI 에이전트(LLM, MCP) 기반 개발 경험을 소개합니다.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: "%s | KISEON.dev",
  },
  description: DESCRIPTION,
  keywords: [
    "한기선",
    "프론트엔드 개발자",
    "프론트엔드 포트폴리오",
    "소프트웨어 포트폴리오",
    "Frontend Developer",
    "React",
    "TypeScript",
    "디자인 시스템",
    "AI Agent",
  ],
  authors: [{ name: "한기선", url: "https://github.com/kiseon77" }],
  creator: "한기선",
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: SITE_URL,
    siteName: "KISEON.dev",
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={`${suit.variable} h-full antialiased`}>
      <body className="min-h-dvh flex flex-col">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
