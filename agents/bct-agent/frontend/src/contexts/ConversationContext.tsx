// src/contexts/ConversationContext.tsx
"use client";

import React, { createContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { Conversation, ChatMessage } from '@/types';

// This is a placeholder for a function that would fetch data from your database.
const fetchConversationsFromDB = async (userId: string): Promise<Conversation[]> => {
  console.log(`Pretending to fetch conversations for user ${userId}...`);
  // For now, we return an empty array to guarantee no initial delay.
  return [];
};

interface ConversationContextType {
  conversations: Conversation[];
  activeConversationId: string | null;
  setActiveConversationId: (id: string | null) => void;
  createNewConversation: () => string;
  deleteConversation: (id: string) => void;
  renameConversation: (id: string, newTitle: string) => void;
  addMessage: (conversationId: string, message: ChatMessage) => void;
  updateConversationTitle: (conversationId: string, newTitle: string) => void;
}

export const ConversationContext = createContext<ConversationContextType | undefined>(undefined);

export function ConversationProvider({ children }: { children: ReactNode }) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const createNewConversation = useCallback(() => {
    const newConversation: Conversation = {
      id: `conv_${Date.now()}`,
      // --- DYNAMIC TITLE: Use a consistent, non-translated key for the default title ---
      // The UI will handle translating this into "New Chat", "Nouveau Chat", etc.
      title: 'New Chat',
      messages: [],
      createdAt: new Date().toISOString(),
    };
    
    setConversations(prev => [newConversation, ...prev]);
    setActiveConversationId(newConversation.id);
    return newConversation.id;
  }, []);

  useEffect(() => {
    const loadData = async () => {
      const userId = localStorage.getItem('bct-user-id') || 'local-user';
      const fetchedConversations = await fetchConversationsFromDB(userId);
      
      if (fetchedConversations.length > 0) {
        setConversations(fetchedConversations);
        setActiveConversationId(fetchedConversations[0].id);
      } else {
        createNewConversation();
      }
      setIsLoaded(true);
    };
    
    if (!isLoaded) {
       loadData();
    }
  }, [isLoaded, createNewConversation]);

  const addMessage = (conversationId: string, message: ChatMessage) => {
    setConversations(prev =>
      prev.map(conv =>
        conv.id === conversationId
          ? { ...conv, messages: [...conv.messages, message] }
          : conv
      )
    );
  };
  
  const deleteConversation = (id: string) => {
    setConversations(prev => prev.filter(conv => conv.id !== id));
    if (activeConversationId === id) {
        const remaining = conversations.filter(conv => conv.id !== id);
        if (remaining.length > 0) {
            setActiveConversationId(remaining[0].id);
        } else {
            createNewConversation();
        }
    }
  };

  const renameConversation = (id: string, newTitle: string) => {
    setConversations(prev =>
        prev.map(conv => (conv.id === id ? { ...conv, title: newTitle } : conv))
    );
  };

  const updateConversationTitle = (conversationId: string, newTitle: string) => {
    renameConversation(conversationId, newTitle);
  };

  const value = {
    conversations,
    activeConversationId,
    setActiveConversationId,
    createNewConversation,
    addMessage,
    deleteConversation,
    renameConversation,
    updateConversationTitle,
  };

  return (
    <ConversationContext.Provider value={value}>
      {children}
    </ConversationContext.Provider>
  );
}

