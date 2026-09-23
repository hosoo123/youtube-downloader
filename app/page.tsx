"use client";

import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [format, setFormat] = useState<"mp3" | "mp4" | "wav">("mp3");
  const [quality, setQuality] = useState<string>("320k");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Формат солигдох үед үндсэн чанарыг тохируулах
  const handleFormatChange = (newFormat: "mp3" | "mp4" | "wav") => {
    setFormat(newFormat);
    if (newFormat === "mp3") setQuality("320k");
    else if (newFormat === "mp4") setQuality("1080p");
    else if (newFormat === "wav") setQuality("best");
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

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Алдаа гарлаа.");
      }

      const blob = await res.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `youtube-${Date.now()}.${format}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(downloadUrl);

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
          placeholder="YouTube бичлэгийн линк оруулах..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full p-3 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
        />

        {/* Формат сонгох */}
        <div className="flex gap-2">
          {(["mp3", "mp4", "wav"] as const).map((fmt) => (
            <button
              key={fmt}
              onClick={() => handleFormatChange(fmt)}
              className={`flex-1 py-2 rounded-lg font-medium uppercase transition ${
                format === fmt ? "bg-blue-600 text-white" : "bg-slate-700 text-slate-300 hover:bg-slate-600"
              }`}
            >
              {fmt}
            </button>
          ))}
        </div>

        {/* MP3 Чанар сонгох */}
        {format === "mp3" && (
          <div className="space-y-1">
            <label className="text-xs text-slate-400">MP3 Аудио чанар:</label>
            <div className="grid grid-cols-4 gap-1.5">
              {[
                { label: "320kbps", value: "320k" },
                { label: "256kbps", value: "256k" },
                { label: "192kbps", value: "192k" },
                { label: "128kbps", value: "128k" },
              ].map((q) => (
                <button
                  key={q.value}
                  onClick={() => setQuality(q.value)}
                  className={`py-1.5 text-xs rounded-lg border transition ${
                    quality === q.value ? "border-blue-500 bg-blue-500/10 text-blue-400 font-semibold" : "border-slate-700 text-slate-400 hover:border-slate-600"
                  }`}
                >
                  {q.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* MP4 Видео чанар сонгох (4K, 2K, 1080p, 720p, 480p, 360p) */}
        {format === "mp4" && (
          <div className="space-y-1">
            <label className="text-xs text-slate-400">MP4 Видео чанар:</label>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { label: "4K (2160p)", value: "4k" },
                { label: "2K (1440p)", value: "2k" },
                { label: "1080p HD", value: "1080p" },
                { label: "720p HD", value: "720p" },
                { label: "480p", value: "480p" },
                { label: "360p", value: "360p" },
              ].map((q) => (
                <button
                  key={q.value}
                  onClick={() => setQuality(q.value)}
                  className={`py-1.5 text-xs rounded-lg border transition ${
                    quality === q.value ? "border-blue-500 bg-blue-500/10 text-blue-400 font-semibold" : "border-slate-700 text-slate-400 hover:border-slate-600"
                  }`}
                >
                  {q.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* WAV сонгосон үед санамж */}
        {format === "wav" && (
          <p className="text-xs text-slate-400 text-center">WAV нь шахталтгүй Uncompressed форматын тул хамгийн дээд чанараараа татагдана.</p>
        )}

        <button
          onClick={handleDownload}
          disabled={loading || !url}
          className="w-full py-3 bg-green-600 hover:bg-green-500 disabled:bg-slate-700 font-semibold rounded-lg transition"
        >
          {loading ? "Файл бэлдэж байна..." : "Татах"}
        </button>

        {error && <p className="text-red-400 text-sm text-center">{error}</p>}
      </div>
    </main>
  );
}