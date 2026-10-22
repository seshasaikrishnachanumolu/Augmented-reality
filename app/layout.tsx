import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SessionCheck } from "@/components/auth/SessionCheck";
import { ServiceWorkerCleaner } from "@/components/layout/ServiceWorkerCleaner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mesha Studio — 3D & AR Scene Editor",
  description: "Build interactive 3D and AR spaces with drag-and-drop assets and block-based logic.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex h-full flex-col">
        <SessionCheck />
        <ServiceWorkerCleaner />
        {children}
      </body>
    </html>
  );
}
