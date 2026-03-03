import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Adventure Guide - Tour & Travel",
  description: "Explore amazing destinations with professional tour guides",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="light">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const savedDarkMode = localStorage.getItem('darkMode');
                  const html = document.documentElement;
                  if (savedDarkMode === 'true') {
                    html.classList.remove('light');
                    html.classList.add('dark');
                  } else if (savedDarkMode === 'false') {
                    html.classList.remove('dark');
                    html.classList.add('light');
                  } else {
                    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                    if (prefersDark) {
                      html.classList.remove('light');
                      html.classList.add('dark');
                    }
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-300`}
      >
        <Navigation />
        {children}
        <Footer />
      </body>
    </html>
  );
}
