"use client";

import React, { useState } from "react";
import {
  Music,
  Sun,
  Moon,
  Link as LinkIcon,
  Clipboard,
  DownloadCloud,
  Loader2,
  ShieldCheck,
  Zap,
  Code2,
  Video,
} from "lucide-react";

export type FormatOption = "mp3" | "mp4" | "wav";
export type AudioBitrate = "128" | "192" | "256" | "320";

export default function AudioExtractorPage() {
  const [isDark, setIsDark] = useState<boolean>(true);
  const [url, setUrl] = useState<string>("");
  const [format, setFormat] = useState<FormatOption>("mp3");
  const [bitrate, setBitrate] = useState<AudioBitrate>("256");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Clipboard paste
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) setUrl(text);
    } catch {
      console.log("Clipboard access denied");
    }
  };

  // Submit Handler
  const handleDownload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, format, bitrate }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || "Татахад алдаа гарлаа.");
      }

      if (data.downloadUrl) {
        // Шууд файлаа браузер дээр татаж эхлүүлэх
        const a = document.createElement("a");
        a.href = data.downloadUrl;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        document.body.appendChild(a);
        a.click();
        a.remove();
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Тодорхойгүй алдаа гарлаа.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDark ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"
      }`}
    >
      <div
        className={`min-h-screen bg-[radial-gradient(circle_at_top,rgba(244,114,182,0.18),transparent_22%),radial-gradient(circle_at_bottom,rgba(59,130,246,0.12),transparent_20%)] transition-colors duration-300 ${
          isDark ? "bg-slate-950" : "bg-slate-50"
        }`}
      >
        <nav
          className={`sticky top-0 z-50 border-b backdrop-blur-xl ${
            isDark
              ? "border-slate-800 bg-slate-900/70"
              : "border-slate-200/80 bg-white/70"
          }`}
        >
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-3">
              <div className="rounded-xl bg-linear-to-tr from-rose-600 to-rose-400 p-2 text-white shadow-lg shadow-rose-500/20">
                <Music className="h-5 w-5" />
              </div>
              <div>
                <span
                  className={`bg-linear-to-r bg-clip-text text-lg font-bold tracking-tight ${
                    isDark
                      ? "from-white to-slate-300 text-transparent"
                      : "from-slate-900 to-slate-700 text-transparent"
                  }`}
                >
                  MediaExtract
                </span>
                <span
                  className={`ml-2 rounded-full px-2 py-0.5 text-xs font-semibold ${
                    isDark
                      ? "bg-rose-500/20 text-rose-400"
                      : "bg-rose-100 text-rose-600"
                  }`}
                >
                  MN
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => setIsDark(!isDark)}
                aria-label="Toggle theme"
                className={`relative inline-flex h-9 w-20 items-center rounded-full border p-1.5 shadow-inner transition-all duration-300 ${
                  isDark
                    ? "border-slate-700 bg-slate-800 shadow-slate-950/60"
                    : "border-slate-200 bg-slate-100 shadow-slate-200/80 hover:shadow-slate-300"
                }`}
              >
                <span
                  className={`absolute top-1.5 flex h-6 w-6 items-center justify-center rounded-full shadow-md transition-all duration-300 ${
                    isDark
                      ? "right-1.5 bg-slate-700 text-sky-400"
                      : "left-1.5 bg-white text-amber-500"
                  }`}
                >
                  {isDark ? (
                    <Moon className="h-3.5 w-3.5" />
                  ) : (
                    <Sun className="h-3.5 w-3.5" />
                  )}
                </span>

                <span className="flex w-full items-center justify-between px-2 text-[10px]">
                  <Sun
                    className={`h-3.5 w-3.5 ${
                      isDark ? "text-amber-500/50" : "text-amber-500"
                    }`}
                  />
                  <Moon
                    className={`h-3.5 w-3.5 ${
                      isDark ? "text-sky-400" : "text-sky-400/50"
                    }`}
                  />
                </span>
              </button>
            </div>
          </div>
        </nav>

        <main className="mx-auto max-w-6xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl space-y-3 text-center">
            <div
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${
                isDark
                  ? "border-slate-700 bg-slate-800 text-slate-300"
                  : "border-slate-200 bg-slate-100 text-slate-600"
              }`}
            >
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Зар сурталчилгаагүй, Шууд MP3 / MP4 / WAV Татагч
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              YouTube Аудио & Видео Хөрвүүлэгч
            </h1>
            <p
              className={`text-sm sm:text-base ${
                isDark ? "text-slate-400" : "text-slate-500"
              }`}
            >
              Линкээ оруулаад MP3, MP4 эсвэл WAV форматаар шууд хуулж аваарай.
            </p>
          </div>

          <div className="mx-auto max-w-2xl">
            <div
              className={`rounded-2xl border p-6 shadow-xl backdrop-blur-md sm:p-8 ${
                isDark
                  ? "border-slate-800 bg-slate-900/75"
                  : "border-slate-200 bg-white/80"
              }`}
            >
              <form onSubmit={handleDownload} className="space-y-6">
                <div className="space-y-2">
                  <label
                    className={`block text-xs font-semibold uppercase tracking-wider ${
                      isDark ? "text-slate-400" : "text-slate-500"
                    }`}
                  >
                    YouTube Бичлэгийн Линк
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute left-4 text-slate-400">
                      <LinkIcon className="h-5 w-5" />
                    </div>
                    <input
                      type="url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="https://www.youtube.com/watch?v=..."
                      required
                      className={`w-full rounded-xl border py-3.5 pl-12 pr-28 text-sm font-medium outline-none transition focus:border-transparent focus:ring-2 focus:ring-rose-500 ${
                        isDark
                          ? "border-slate-700 bg-slate-900 text-slate-100"
                          : "border-slate-200 bg-slate-50 text-slate-900"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={handlePaste}
                      className={`absolute right-3 flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                        isDark
                          ? "bg-slate-800 text-slate-300 hover:bg-slate-700"
                          : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                      }`}
                    >
                      <Clipboard className="h-3.5 w-3.5" />
                      Буулгах
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      className={`mb-2 block text-xs font-semibold uppercase tracking-wider ${
                        isDark ? "text-slate-400" : "text-slate-500"
                      }`}
                    >
                      Формат (Format)
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(["mp3", "mp4", "wav"] as FormatOption[]).map((fmt) => (
                        <button
                          key={fmt}
                          type="button"
                          onClick={() => setFormat(fmt)}
                          className={`rounded-lg border px-3 py-2 text-xs font-bold transition ${
                            format === fmt
                              ? "border-rose-500 bg-rose-500/10 text-rose-600"
                              : isDark
                                ? "border-slate-800 text-slate-400 hover:border-slate-600"
                                : "border-slate-200 text-slate-600 hover:border-slate-400"
                          }`}
                        >
                          {fmt.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label
                      className={`mb-2 block text-xs font-semibold uppercase tracking-wider ${
                        isDark ? "text-slate-400" : "text-slate-500"
                      }`}
                    >
                      Чанар (Bitrate / Quality)
                    </label>
                    <select
                      value={bitrate}
                      onChange={(e) =>
                        setBitrate(e.target.value as AudioBitrate)
                      }
                      disabled={format === "mp4"}
                      className={`w-full rounded-lg border px-3 py-2 text-xs font-medium outline-none focus:ring-2 focus:ring-rose-500 disabled:opacity-50 ${
                        isDark
                          ? "border-slate-700 bg-slate-900 text-slate-100"
                          : "border-slate-200 bg-slate-50 text-slate-900"
                      }`}
                    >
                      <option value="320">320 kbps (Хамгийн дээд)</option>
                      <option value="256">256 kbps (Өндөр)</option>
                      <option value="192">192 kbps (Дундаж)</option>
                      <option value="128">128 kbps (Стандарт)</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center space-x-2 rounded-xl bg-linear-to-r from-rose-600 to-pink-600 py-3.5 font-semibold text-white shadow-lg shadow-rose-500/25 transition-all duration-200 hover:from-rose-700 hover:to-pink-700 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Боловсруулж байна...</span>
                    </>
                  ) : format === "mp4" ? (
                    <>
                      <Video className="h-5 w-5" />
                      <span>MP4 Видео Татах</span>
                    </>
                  ) : (
                    <>
                      <DownloadCloud className="h-5 w-5" />
                      <span>{format.toUpperCase()} Татах</span>
                    </>
                  )}
                </button>
              </form>

              {error && (
                <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-center text-xs font-medium text-red-500">
                  {error}
                </div>
              )}
            </div>
          </div>

          <div className="mx-auto grid max-w-4xl gap-4 md:grid-cols-3">
            <div
              className={`rounded-xl border p-5 ${
                isDark
                  ? "border-slate-800 bg-slate-900/75"
                  : "border-slate-200 bg-white/80"
              }`}
            >
              <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500/10 text-rose-500">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold">Зар ба Спамгүй</h3>
              <p
                className={`mt-2 text-xs ${
                  isDark ? "text-slate-400" : "text-slate-500"
                }`}
              >
                Байнгын pop-up нээгддэг сурталчилгаа болон аюултай линк байхгүй.
              </p>
            </div>

            <div
              className={`rounded-xl border p-5 ${
                isDark
                  ? "border-slate-800 bg-slate-900/75"
                  : "border-slate-200 bg-white/80"
              }`}
            >
              <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500/10 text-rose-500">
                <Zap className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold">Түргэн Шуурхай</h3>
              <p
                className={`mt-2 text-xs ${
                  isDark ? "text-slate-400" : "text-slate-500"
                }`}
              >
                Ашиглахад хялбар, хурдан шуурхай татаж авах боломжтой.
              </p>
            </div>

            <div
              className={`rounded-xl border p-5 ${
                isDark
                  ? "border-slate-800 bg-slate-900/75"
                  : "border-slate-200 bg-white/80"
              }`}
            >
              <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
                <Code2 className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold">MP3 / MP4 / WAV</h3>
              <p
                className={`mt-2 text-xs ${
                  isDark ? "text-slate-400" : "text-slate-500"
                }`}
              >
                Дуу болон бичлэгийг хүссэн форматаараа авах боломжтой.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
