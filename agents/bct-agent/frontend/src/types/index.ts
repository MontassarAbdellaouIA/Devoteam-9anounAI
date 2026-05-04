// src/types/index.ts

/**
 * Defines the structure for a single citation, providing a verifiable source.
 * The `document` property holds the direct URL to the source.
 */
export interface Citation {
  document: string; // This will hold the URL from the backend
  page?: number;    // Optional page number
  text?: string;    // Optional text snippet
}

/**
 * Defines the structure for a single chat message.
 * This is the fundamental building block of a conversation.
 */
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'error';
  content: string;
  citations?: Citation[]; // Optional, typically for assistant messages
}

/**
 * Defines the structure for an entire conversation session.
 * This will be used to store chat history locally and in the database later.
 */
export interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: string; // ISO date string
}

/**
 * Defines the shape of the data sent to our Next.js backend API route.
 */
export interface QueryApiPayload {
  message: ChatMessage;
}

/**
 * Defines the shape of the successful response from our Next.js backend API route.
 */
export interface QueryApiResponse {
  responseMessage: ChatMessage;
}
