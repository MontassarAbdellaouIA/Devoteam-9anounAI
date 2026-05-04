// src/components/nav-user.tsx
"use client"

import {
  ChevronsUpDown,
} from "lucide-react"
import { UserButton } from "@clerk/nextjs";
import { useLanguage } from "@/contexts/LanguageContext";


export function NavUser() {
  const { translations } = useLanguage();

  return (
    // The UserButton component from Clerk handles all user-related actions,
    // including displaying the avatar, name, email, and the sign-out button.
    <div className="p-2">
       <UserButton 
        afterSignOutUrl="/sign-in"
        appearance={{
            elements: {
                // This targets the main button element
                userButtonTrigger: "w-full flex items-center gap-2 p-2 rounded-md text-sm text-left hover:bg-sidebar-accent",
                userButtonAvatarBox: "h-8 w-8 rounded-lg",
                userButtonAvatarImage: "rounded-lg",
                // This targets the user's name and email container
                userButtonBox: "grid flex-1 text-left text-sm leading-tight",
                userButtonName: "truncate font-medium text-sidebar-foreground",
                userButtonEmail: "truncate text-xs text-muted-foreground"
            }
        }}
        showName={true} // This ensures the user's name is displayed
       />
    </div>
  )
}
