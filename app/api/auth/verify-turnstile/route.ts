import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const TURNSTILE_SECRET_KEY = process.env.TURNSTILE_SECRET_KEY;

  if (!TURNSTILE_SECRET_KEY) {
    console.error("TURNSTILE_SECRET_KEY is not configured");
    return NextResponse.json(
      { success: false, error: "Server configuration error" },
      { status: 500 }
    );
  }
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Token is required" },
        { status: 400 }
      );
    }

    // Verify token with Cloudflare Turnstile API
    const verifyResponse = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          secret: TURNSTILE_SECRET_KEY,
          response: token,
        }),
      }
    );

    const verifyData = await verifyResponse.json();

    if (verifyData.success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { 
          success: false, 
          error: "Verification failed",
          errorCodes: verifyData["error-codes"]
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Turnstile verification error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
