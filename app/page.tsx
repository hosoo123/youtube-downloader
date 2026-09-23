"use client";

import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [format, setFormat] = useState<"mp3" | "mp4" | "wav">("mp3");
  const [quality, setQuality] = useState<"best" | "1080p" | "720p">("best");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Линкийг шууд файл болгож татуулах функц
  const forceDownload = async (downloadUrl: string, filename: string) => {
    try {
      const res = await fetch(downloadUrl);
      const blob = await res.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch {
      // Хэрэв CORS-оос болж blob үүсэхгүй бол шууд татах линкээр нээнэ
      window.location.href = downloadUrl;
    }
  };

  const handleDownload = async () => {
    if (!url) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, format, quality }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      // Файлын нэр үүсгэж татуулна
      const ext = format;
      const filename = `download.${ext}`;
      await forceDownload(data.downloadUrl, filename);

    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Татахад алдаа гарлаа.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-slate-900 text-white">
      <div className="w-full max-w-md space-y-4 bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-xl">
        <h1 className="text-2xl font-bold text-center">YouTube Downloader</h1>
        
        <input
          type="text"
          placeholder="YouTube видео линк оруулна уу..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full p-3 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
        />

        {/* Формат сонгох */}
        <div className="flex gap-2">
          {(["mp3", "mp4", "wav"] as const).map((fmt) => (
            <button
              key={fmt}
              onClick={() => setFormat(fmt)}
              className={`flex-1 py-2 rounded-lg font-medium uppercase transition ${
                format === fmt ? "bg-blue-600 text-white" : "bg-slate-700 text-slate-300 hover:bg-slate-600"
              }`}
            >
              {fmt}
            </button>
          ))}
        </div>

        {/* MP4 сонгосон үед чанар сонгох */}
        {format === "mp4" && (
          <div className="flex gap-2 pt-1">
            {(["best", "1080p", "720p"] as const).map((q) => (
              <button
                key={q}
                onClick={() => setQuality(q)}
                className={`flex-1 py-1.5 text-sm rounded-lg border transition ${
                  quality === q ? "border-blue-500 bg-blue-500/10 text-blue-400" : "border-slate-700 text-slate-400"
                }`}
              >
                {q === "best" ? "Хамгийн сайн" : q}
              </button>
            ))}
          </div>
        )}

        <button
          onClick={handleDownload}
          disabled={loading || !url}
          className="w-full py-3 bg-green-600 hover:bg-green-500 disabled:bg-slate-700 font-semibold rounded-lg transition"
        >
          {loading ? "Боловсруулж байна..." : "Татах"}
        </button>

        {error && <p className="text-red-400 text-sm text-center">{error}</p>}
      </div>
    </main>
  );
}