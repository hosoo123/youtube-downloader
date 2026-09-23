import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const response = await fetch("https://youtube-downloader-dt2g.onrender.com/download", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Татахад алдаа гарлаа." }, { status: 400 });
    }

    // Render-ээс ирсэн файлын урсгалыг (stream) шууд буцаана
    return new NextResponse(response.body, {
      headers: {
        "Content-Type": response.headers.get("Content-Type") || "application/octet-stream",
        "Content-Disposition": response.headers.get("Content-Disposition") || "attachment",
      },
    });
  } catch (error: unknown) {
    console.error("Fetch Error:", error);
    return NextResponse.json({ error: "Сервертэй холбогдож чадсангүй." }, { status: 500 });
  }
}