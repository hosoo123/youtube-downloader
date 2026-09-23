import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json(
        { error: "YouTube линк оруулна уу." },
        { status: 400 },
      );
    }

    // Render дээрх сервер рүүгээ /extract endpoint-оор хүсэлт илгээнэ
    const response = await fetch(
      "https://youtube-downloader-dt2g.onrender.com/extract",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || "Файл боловсруулахад алдаа гарлаа." },
        { status: 400 },
      );
    }

    return NextResponse.json({
      success: true,
      downloadUrl: data.downloadUrl,
    });
  } catch (error: unknown) {
    console.error("Download Error:", error);
    return NextResponse.json(
      { error: "Сервертэй холбогдож чадсангүй." },
      { status: 500 },
    );
  }
}
