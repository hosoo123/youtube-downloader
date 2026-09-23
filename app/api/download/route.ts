import { NextRequest, NextResponse } from 'next/server';
import ytdl from '@distube/ytdl-core';

type FormatOption = 'mp3' | 'mp4' | 'wav';

export async function POST(req: NextRequest) {
  try {
    const { url, format = 'mp3' } = (await req.json()) as { url: string; format: FormatOption };

    if (!url || !ytdl.validateURL(url)) {
      return NextResponse.json(
        { error: 'Зөв YouTube видео линк оруулна уу!' },
        { status: 400 }
      );
    }

    const info = await ytdl.getInfo(url);
    const rawTitle = info.videoDetails.title;
    const cleanTitle = rawTitle.replace(/[^\w\s-]/gi, '').trim() || 'media';

    // MP4 бол видео+аудио, бусад нь зөвхөн аудио
    const streamOptions: ytdl.downloadOptions = format === 'mp4' 
      ? { quality: 'highestvideo', filter: 'audioandvideo' }
      : { quality: 'highestaudio', filter: 'audioonly' };

    const mediaStream = ytdl(url, streamOptions);

    // Header Content-Type тохируулах
    let contentType = 'audio/mpeg';
    if (format === 'mp4') {
      contentType = 'video/mp4';
    } else if (format === 'wav') {
      contentType = 'audio/wav';
    }

    const encodedFilename = encodeURIComponent(`${cleanTitle}.${format}`);

    return new NextResponse(mediaStream as unknown as ReadableStream, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${encodedFilename}"; filename*=UTF-8''${encodedFilename}`,
      },
    });
  } catch (error: unknown) {
    console.error('Download Route Error:', error);
    const message = error instanceof Error ? error.message : 'Тодорхойгүй алдаа';
    return NextResponse.json(
      { error: `Файл хөрвүүлж татахад алдаа гарлаа: ${message}` },
      { status: 500 }
    );
  }
}