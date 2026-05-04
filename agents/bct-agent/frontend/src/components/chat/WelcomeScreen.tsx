// src/components/features/chat/WelcomeScreen.tsx
"use client"

import Image from "next/image";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

import { useLanguage } from "@/contexts/LanguageContext";

export function WelcomeScreen() {
  const { theme } = useTheme();
  const { translations } = useLanguage();
  // State to track if the component is mounted on the client
  const [isClient, setIsClient] = useState(false);

  // This effect runs only once on the client, after the initial render
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Determine the correct logo source based on the theme
  const mainLogoSrc = theme === 'light'
    ? "/BCT logo add color.png"
    : "/BCT logo add color wh.png";

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 p-2 text-center">
      <div className="flex items-center" style={{ minHeight: 230 }}>
        {/*
          Only render the Image component if we are on the client side.
          This prevents the server from rendering one image and the client another,
          thus avoiding the hydration mismatch error.
          The minHeight on the parent div prevents layout shift while waiting to render.
        */}
        {isClient && (
          <Image
            src={mainLogoSrc}
            alt="BCT Logo"
            width={500}
            height={230}
            priority
          />
        )}
      </div>
      <h1 className="text-2xl font-medium tracking-tight text-foreground/80 md:text-3xl lg:text-3xl">
        {translations.welcome_message}
      </h1>
    </div>
  );
}
