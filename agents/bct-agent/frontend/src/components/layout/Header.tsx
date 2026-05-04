// src/components/layout/Header.tsx
"use client"

import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export function ModeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </Button>
  )
}

export function Header() {
  const { language, setLanguage } = useLanguage();
  const { translations } = useLanguage()

  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-2 px-4">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
        <h2 className="text-sm font-semibold text-muted-foreground">
          {translations.title}
        </h2>
      </div>
      <div className="flex items-center gap-2">
        <ModeToggle />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setLanguage(language === "en" ? "fr" : language === "fr" ? "ar" : "en")}
        >
          {language.toUpperCase()}
        </Button>
      </div>
    </header>
  );
}
