import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = request.nextUrl.searchParams.get("url");
    if (!url) {
      return NextResponse.json({ error: "Missing url" }, { status: 400 });
    }

    const response = await fetch(url);
    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch file" }, { status: 500 });
    }

    const contentType = response.headers.get("content-type") || "application/octet-stream";
    const buffer = await response.arrayBuffer();

    // Extract filename from URL
    const filename = url.split("/").pop() || "download";

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Error proxying download:", error);
    return NextResponse.json({ error: "Download failed" }, { status: 500 });
  }
}
