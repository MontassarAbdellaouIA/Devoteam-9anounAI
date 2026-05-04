// src/app/page.tsx
"use client";

import { AppSidebar } from "@/components/layout/AppSidebar";
import { Header } from "@/components/layout/Header";
import { ChatInput } from "@/components/chat/ChatInput";
import { WelcomeScreen } from "@/components/chat/WelcomeScreen";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ChatHistory } from "@/components/chat/ChatHistory";
import { useChat } from "@/hooks/useChat";
import { ConversationProvider } from "@/contexts/ConversationContext";
import { useLanguage } from "@/contexts/LanguageContext";

// The main page now wraps the interface in the new ConversationProvider.
export default function AssistantPage() {
  return (
    <ConversationProvider>
      <ChatInterface />
    </ConversationProvider>
  );
}

// The core Chat Interface component remains clean and reads from the useChat hook.
function ChatInterface() {
  // The hook now gets all its state from the single ConversationContext.
  const { messages, isLoading, sendMessage } = useChat();
  const { translations, dir } = useLanguage();

  return (
    <SidebarProvider className="pt-8" dir={dir}>
      <AppSidebar side={dir === 'rtl' ? 'right' : 'left'} />
      
      <SidebarInset className="flex h-[92vh] flex-col bg-background text-foreground pb-4">
        <Header />

        <main className="flex-1 overflow-y-auto relative">
          {messages.length === 0 && !isLoading ? (
            <div className="flex h-full items-center justify-center p-4">
              <WelcomeScreen />
            </div>
          ) : (
            <ChatHistory messages={messages} isLoading={isLoading} />
          )}
        </main>

        <footer className="p-4 bg-background">
          <div className="max-w-3xl mx-auto">
            <ChatInput
              isLoading={isLoading}
              onSendMessage={sendMessage}
            />
            <p className="text-xs text-center text-muted-foreground mt-2 -mb-4">
              {translations.disclaimer}
            </p>
          </div>
        </footer>
      </SidebarInset>
    </SidebarProvider>
  );
}
