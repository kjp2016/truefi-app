import { NextRequest, NextResponse } from "next/server";

// CORS helper function
function setCorsHeaders(res: NextResponse) {
  res.headers.set("Access-Control-Allow-Origin", "https://truefi.ai"); // Restrict to production
  res.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type, X-Session-Id");
  return res;
}

export async function OPTIONS() {
  const res = new NextResponse(null, { status: 200 });
  return setCorsHeaders(res);
}

export async function POST(req: NextRequest) {
  try {
    const { message, sessionId } = await req.json();

    if (!message) {
      return setCorsHeaders(NextResponse.json({ error: "Message is required" }, { status: 400 }));
    }
    if (!sessionId) {
      return setCorsHeaders(NextResponse.json({ error: "Session ID is required" }, { status: 400 }));
    }

    const pennyApiUrl = process.env.PENNY_PYTHON_BACKEND_URL || "http://localhost:8000/api/chat";
    console.log(`Next.js API route (/api/chat) forwarding to: ${pennyApiUrl}`);
    console.log(`Sending to Penny backend: session_id: ${sessionId}, message: ${message}`);

    const pennyResponse = await fetch(pennyApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        session_id: sessionId,
        message: message,
      }),
    });

    const pennyData = await pennyResponse.json();

    if (!pennyResponse.ok) {
      console.error("Error from Penny Python Backend:", pennyResponse.status, pennyData);
      throw new Error("Failed to process your request. Please try again later.");
    }

    if (typeof pennyData.reply !== "string") {
      console.error("Invalid or non-string reply from Penny backend. Received:", pennyData.reply);
      throw new Error("Received invalid response format from the AI assistant.");
    }

    const res = NextResponse.json({ reply: pennyData.reply });
    return setCorsHeaders(res);
  } catch (error: any) {
    console.error("Error in Next.js /api/chat route:", error);
    const res = NextResponse.json(
      { error: error.message || "Failed to process chat request via Next.js API route" },
      { status: 500 }
    );
    return setCorsHeaders(res);
  }
}