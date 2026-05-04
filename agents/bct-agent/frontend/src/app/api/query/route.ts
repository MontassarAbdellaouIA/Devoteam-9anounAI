// src/app/api/query/route.ts

import { NextResponse } from 'next/server';
import { ChatMessage, Citation, QueryApiPayload, QueryApiResponse } from '@/types';

// This is the backend server's address.

const BACKEND_API_URL = process.env.BACKEND_API_URL || 'http://127.0.0.1:8000/query';

// Define the expected structure of a successful response from the FastAPI backend
interface BackendSuccessResponse {
  status: "success";
  data: {
    answer: string;
    sources: string[];
  };
}

// Define the expected structure of an error response from the FastAPI backend
interface BackendErrorResponse {
  status: "error";
  details: string;
}

type BackendResponse = BackendSuccessResponse | BackendErrorResponse;

// This function handles POST requests to /api/query
export async function POST(request: Request) {
  try {
    const body: QueryApiPayload = await request.json();
    const userMessage = body.message.content;

    // --- RAG Model Integration Point ---
    // Send the user's question to the FastAPI backend
    const backendResponse = await fetch(BACKEND_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({ question: userMessage }),
    });

    if (!backendResponse.ok) {
        // Handle network-level errors (e.g., server is down)
        throw new Error(`Backend API request failed with status ${backendResponse.status}`);
    }

    const backendData: BackendResponse = await backendResponse.json();

    let assistantResponse: ChatMessage;

    if (backendData.status === "success") {
        // --- Data Transformation ---
        // Convert the backend's source URLs into the frontend's Citation format.
        const citations: Citation[] = backendData.data.sources.map((sourceUrl) => ({
            document: sourceUrl,
            // The backend does not provide page numbers or specific text excerpts in the final response,
            // so we provide sensible defaults.
            page: 1, 
            text: "Consultez ce document pour vérification.",
        }));

        assistantResponse = {
            id: `assistant-${Date.now()}`,
            role: 'assistant',
            content: backendData.data.answer,
            citations: citations,
        };

    } else {
        // Handle application-level errors reported by the backend
        assistantResponse = {
            id: `error-${Date.now()}`,
            role: 'error',
            content: backendData.details || 'An unknown error occurred on the backend.',
        };
    }
    // --- End Integration Point ---

    const responsePayload: QueryApiResponse = {
      responseMessage: assistantResponse,
    };

    return NextResponse.json(responsePayload);

  } catch (error) {
    console.error("Error in /api/query:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    // Return a structured error response that the frontend can handle
    return NextResponse.json(
      { 
        responseMessage: {
            id: `error-catch-${Date.now()}`,
            role: 'error',
            content: `Failed to connect to the assistant: ${errorMessage}`,
        }
      },
      { status: 500 }
    );
  }
}
