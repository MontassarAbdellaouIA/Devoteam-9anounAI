// src/lib/api/chat.ts
import { QueryApiPayload, QueryApiResponse, ChatMessage } from "@/types";

/**
 * Sends a user's message to the backend RAG API and gets the assistant's response.
 *
 * @param payload - The data containing the new message.
 * @returns The assistant's response message.
 */
export async function queryAssistant(payload: QueryApiPayload): Promise<ChatMessage> {
  try {
    const response = await fetch('/api/query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      // Try to parse the error message from the backend, otherwise throw a generic error.
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.responseMessage?.content || 'An error occurred while querying the assistant.');
    }

    const data: QueryApiResponse = await response.json();
    return data.responseMessage;

  } catch (error) {
    console.error("API query failed:", error);
    // In case of a network error or other exception, create and return a standardized error message object.
    const errorMessage: ChatMessage = {
      id: `error-${Date.now()}`,
      role: 'error',
      content: error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.',
    };
    // We throw the error so the calling function in useChat can catch it and display the message.
    throw errorMessage;
  }
}

/**
 * Sends feedback for a specific message to the backend.
 * @param messageId - The ID of the message being rated.
 * @param feedback - "positive" or "negative".
 */
export async function sendFeedback(messageId: string, feedback: "positive" | "negative") {
    try {
        const response = await fetch('/api/feedback', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ messageId, feedback }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'An error occurred while sending feedback.');
        }

        return await response.json();
    } catch (error) {
        console.error("Failed to send feedback:", error);
        return null;
    }
}
