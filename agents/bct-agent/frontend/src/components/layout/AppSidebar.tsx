// src/components/layout/AppSidebar.tsx
"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { Moon, Sun, Plus, MoreHorizontal, Trash2, Edit } from "lucide-react"
import { useTheme } from "next-themes"
import { useContext, useState, useEffect } from "react"

import { NavUser } from "@/components/nav-user"
import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenuAction,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ConversationContext } from "@/contexts/ConversationContext"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/contexts/LanguageContext"

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
    side: 'left' | 'right';
}

export function AppSidebar({ side, ...props }: AppSidebarProps) {
  const { theme } = useTheme()
  const { translations, dir } = useLanguage()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const conversationContext = useContext(ConversationContext)
  if (!conversationContext) {
    throw new Error("AppSidebar must be used within a ConversationProvider")
  }
  
  const {
    conversations,
    activeConversationId,
    createNewConversation,
    setActiveConversationId,
    deleteConversation,
    renameConversation,
  } = conversationContext

  const handleNewChatClick = () => {
    // --- FIX: Prevent duplicate empty chats ---
    // First, check if an empty "New Chat" already exists.
    const existingEmptyChat = conversations.find(
      (conv) => conv.title === 'New Chat' && conv.messages.length === 0
    );

    if (existingEmptyChat) {
      // If it exists, just make it the active conversation instead of creating a new one.
      setActiveConversationId(existingEmptyChat.id);
    } else {
      // If it does not exist, create a new one as usual.
      createNewConversation();
    }
  };

  const handleRename = (id: string) => {
    const newTitle = prompt(translations.rename)
    if (newTitle && newTitle.trim() !== "") {
      renameConversation(id, newTitle)
    }
  }

  const logoSrc = theme === "light" ? "/BCT.png" : "/BCT white.png"

  return (
    <Sidebar variant="inset" side={side} {...props}>
      <SidebarHeader>
        <Link
          href="/"
          className="flex items-center justify-center gap-2 mt-3"
          style={{ minHeight: 120 }}
        >
          {isClient && (
            <Image
              src={logoSrc}
              alt="Company Logo"
              width={150}
              height={120}
              priority
            />
          )}
        </Link>
      </SidebarHeader>
      <SidebarContent className="flex flex-col">
        <div className="mb-4 mt-6">
          <Button
            className={cn(
                "w-full gap-2 bg-card text-card-foreground hover:bg-card/20 border border-[#13265e]/20",
                dir === 'rtl' ? "justify-end flex-row-reverse" : "justify-start"
            )}
            onClick={handleNewChatClick}
          >
            <Plus className="w-5 h-5" />
            <span>{translations.new_chat}</span>
          </Button>
        </div>

        <SidebarGroup className="flex-grow overflow-y-auto">
          <SidebarGroupLabel className={cn(dir === 'rtl' && "text-right")}>
            {translations.recent_discussions}
          </SidebarGroupLabel>
          <SidebarMenu>
            {conversations.map(conv => (
              <SidebarMenuItem key={conv.id} className={cn(dir === 'rtl' && "flex-row-reverse")}>
                <SidebarMenuButton
                  onClick={() => setActiveConversationId(conv.id)}
                  className={cn(
                    "text-muted-foreground hover:text-foreground",
                    dir === 'rtl' && "text-right", 
                    {
                      "bg-sidebar-accent text-sidebar-accent-foreground":
                        activeConversationId === conv.id,
                    }
                  )}
                >
                  <span className="truncate flex-1">
                    {conv.title === 'New Chat' ? translations.new_chat : conv.title}
                  </span>
                </SidebarMenuButton>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuAction showOnHover>
                      <MoreHorizontal />
                      <span className="sr-only">{translations.more}</span>
                    </SidebarMenuAction>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-48"
                    side={dir === 'rtl' ? "left" : "right"}
                    align="start"
                  >
                    <DropdownMenuItem onClick={() => handleRename(conv.id)} className={cn(dir === 'rtl' && "flex-row-reverse justify-between")}>
                      <Edit className="h-4 w-4" />
                      <span>{translations.rename}</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => deleteConversation(conv.id)}
                      className={cn(
                        "text-red-500 focus:text-red-500 focus:bg-red-500/10",
                        dir === 'rtl' && "flex-row-reverse justify-between"
                        )}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>{translations.delete}</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}

