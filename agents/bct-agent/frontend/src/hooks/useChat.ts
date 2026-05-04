// src/hooks/useChat.ts
import { useState, useContext } from 'react';
import { ChatMessage } from '@/types';
import { queryAssistant } from '@/lib/api/chat';
import { ConversationContext } from '@/contexts/ConversationContext';

export function useChat() {
  const [isLoading, setIsLoading] = useState(false);
  const context = useContext(ConversationContext);

  if (!context) {
    throw new Error("useChat must be used within a ConversationProvider");
  }

  const {
    activeConversationId,
    conversations,
    addMessage,
    updateConversationTitle,
    createNewConversation,
  } = context;

  const activeConversation = conversations.find(c => c.id === activeConversationId);

  const sendMessage = async (content: string) => {
    let currentConversationId = activeConversationId;

    if (!currentConversationId) {
        currentConversationId = createNewConversation();
    }
    
    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content,
    };
    
    addMessage(currentConversationId, userMessage);
    setIsLoading(true);

    // --- DYNAMIC TITLE LOGIC ---
    // Check if the current conversation's title is the default "New Chat".
    // This is a reliable way to know it's the first real message.
    if (activeConversation?.title === 'New Chat') {
        // Create a short title from the user's message.
        const newTitle = content.split(' ').slice(0, 5).join(' ') + (content.split(' ').length > 5 ? '...' : '');
        updateConversationTitle(currentConversationId, newTitle);
    }

    try {
      const responseMessage = await queryAssistant({ message: userMessage });
      addMessage(currentConversationId, responseMessage);

    } catch (error) {
      console.error("Failed to get response from API:", error);
       if (error && typeof error === 'object' && 'role' in error && error.role === 'error') {
         addMessage(currentConversationId, error as ChatMessage);
      } else {
         const unknownError: ChatMessage = {
            id: `err_${Date.now()}`,
            role: 'error',
            content: 'An unexpected error occurred. Please check the console.',
         };
         addMessage(currentConversationId, unknownError);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages: activeConversation?.messages || [],
    isLoading,
    sendMessage,
  };
}

