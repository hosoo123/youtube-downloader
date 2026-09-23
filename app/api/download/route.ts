import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { url, format, quality } = await req.json();

    if (!url) {
      return NextResponse.json(
        { error: "YouTube линк оруулна уу." },
        { status: 400 },
      );
    }

    const response = await fetch(
      "https://youtube-downloader-dt2g.onrender.com/extract",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, format, quality }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || "Алдаа гарлаа." },
        { status: 400 },
      );
    }

    return NextResponse.json({ success: true, downloadUrl: data.downloadUrl });
  } catch (error: unknown) {
    console.error("Fetch Error:", error); // error-ийг энд хэвлэж ашигласнаар ESLint сануулга арилна
    return NextResponse.json(
      { error: "Сервертэй холбогдож чадсангүй." },
      { status: 500 },
    );
  }
}
