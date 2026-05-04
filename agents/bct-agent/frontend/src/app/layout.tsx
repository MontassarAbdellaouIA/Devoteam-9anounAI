// src/app/layout.tsx
"use client" 

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SessionProvider } from "@/contexts/SessionContext";
import { ConversationProvider } from "@/contexts/ConversationContext";
import { ClerkProvider } from '@clerk/nextjs'
import { LanguageProvider, useLanguage } from "@/contexts/LanguageContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


function AppLayout({ children }: { children: React.ReactNode }) {
  const { dir } = useLanguage();

  return (
    <html lang="en" suppressHydrationWarning dir={dir}>
      <head>
        <title>BCT Assistant Reglementaire IA</title>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <SessionProvider>
              <ConversationProvider>
                {children}
              </ConversationProvider>
            </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
    <LanguageProvider>
        <AppLayout>{children}</AppLayout>
    </LanguageProvider>
  </ClerkProvider>
  );
}
