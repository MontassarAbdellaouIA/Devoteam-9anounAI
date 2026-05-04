// src/components/auth/LoginDialog.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "next-themes";

interface LoginDialogProps {
  onLoginSuccess: () => void;
}

export function LoginDialog({ onLoginSuccess }: LoginDialogProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { translations } = useLanguage();
  const { theme } = useTheme();

  const handleLogin = () => {
    // This is a simplified mock login. 
    // In a real application, you would make an API call to an authentication endpoint.
    if (username && password) {
      setError("");
      onLoginSuccess();
    } else {
      setError("Please enter both username and password.");
    }
  };

  const logoSrc = theme === "dark" ? "/BCT white.png" : "/BCT.png";

  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-[425px] " onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader className="flex flex-col items-center text-center">
            <Image src={logoSrc} alt="BCT Logo" width={100} height={80} className="mb-4"/>
          <DialogTitle className="text-2xl font-bold">
            {translations.bct_title || "Central Bank of Tunisia"}
          </DialogTitle>
          <DialogDescription>
            {translations.login_prompt || "Please log in to access the Regulatory Assistant."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="username" className="text-right text-sm">
              {translations.username || "Username"}
            </label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="password"className="text-right text-sm">
              {translations.password || "Password"}
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="col-span-3"
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center col-span-4">{error}</p>}
        </div>
        <DialogFooter>
          <Button onClick={handleLogin} className="w-full">
            {translations.login || "Login"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
