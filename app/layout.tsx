import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://dev-protfoil.vercel.app";

const TITLE = "한기선 | Frontend Developer Portfolio";
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
  other: {
    rel: "stylesheet",
    href: "https://cdn.jsdelivr.net/gh/sun-typeface/SUIT@2/fonts/variable/woff2/SUIT-Variable.css",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={`h-full antialiased`}>
      <body
        className="h-dvh flex flex-col overflow-hidden"
        style={{ fontFamily: "'SUIT Variable', sans-serif" }}
      >
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
