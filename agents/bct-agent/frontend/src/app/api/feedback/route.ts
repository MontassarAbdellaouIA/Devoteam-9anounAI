// src/app/api/feedback/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { messageId, feedback } = await req.json();

    if (!messageId || !feedback) {
      return NextResponse.json({ error: "Missing messageId or feedback" }, { status: 400 });
    }

    // For now, we'll just log the feedback to the console.
    // In a real application, you would store this in a database.
    console.log(`Feedback received for message ${messageId}: ${feedback}`);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error processing feedback:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
