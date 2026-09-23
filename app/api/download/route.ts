import { NextRequest, NextResponse } from "next/server";

// RapidAPI-аас ирэх файлын линкийн бүтэц
interface DownloadItem {
  quality?: string;
  isAudio?: boolean;
  format?: string;
  link?: string;
}

// RapidAPI хариултын бүтэц
interface RapidApiResponse {
  error?: boolean;
  title?: string;
  links?: DownloadItem[];
}

export async function POST(req: NextRequest) {
  try {
    const { url, format = "mp3" } = await req.json();

    if (!url) {
      return NextResponse.json(
        { error: "YouTube линк оруулна уу." },
        { status: 400 },
      );
    }

    const apiKey = process.env.RAPIDAPI_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "RAPIDAPI_KEY тохируулагдаагүй байна." },
        { status: 500 },
      );
    }

    const options = {
      method: "GET",
      headers: {
        "x-rapidapi-key": apiKey,
        "x-rapidapi-host": "social-media-video-downloader.p.rapidapi.com",
      },
    };

    const apiUrl = `https://social-media-video-downloader.p.rapidapi.com/smvd/get/all?url=${encodeURIComponent(
      url,
    )}`;

    const response = await fetch(apiUrl, options);
    const data = (await response.json()) as RapidApiResponse;

    if (!response.ok || !data || data.error) {
      return NextResponse.json(
        { error: "Бичлэгийн мэдээлэл авахад алдаа гарлаа. Линкээ шалгана уу." },
        { status: 400 },
      );
    }

    // Аудио эсвэл видео линкийг шүүж авах (any-гүйгээр)
    let downloadLink = "";

    if (format === "mp4") {
      downloadLink =
        data.links?.find(
          (item: DownloadItem) =>
            item.quality === "hd" || item.quality === "sd",
        )?.link ||
        data.links?.[0]?.link ||
        "";
    } else {
      // Audio / MP3
      downloadLink =
        data.links?.find(
          (item: DownloadItem) => item.isAudio || item.format === "mp3",
        )?.link ||
        data.links?.[0]?.link ||
        "";
    }

    if (!downloadLink) {
      return NextResponse.json(
        { error: "Татах боломжтой файлын линк олдсонгүй." },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      downloadUrl: downloadLink,
      title: data.title || "audio",
    });
  } catch (error: unknown) {
    console.error("Download Route Error:", error);
    return NextResponse.json(
      { error: "Серверт алдаа гарлаа. Дахин залгаж үзнэ үү." },
      { status: 500 },
    );
  }
}
