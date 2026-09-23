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
import { FormatOption, AudioBitrate } from "./types";

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

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Татахад алдаа гарлаа.");
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `youtube-download.${format}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(downloadUrl);
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
    <div className={isDark ? "dark" : ""}>
      <div className="bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 min-h-screen transition-colors duration-300">
        {/* Navbar */}
        <nav className="border-b border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-linear-to-tr from-rose-600 to-rose-400 text-white p-2 rounded-xl shadow-lg shadow-rose-500/20">
                <Music className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-lg tracking-tight bg-linear-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                  MediaExtract
                </span>
                <span className="text-xs bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 font-semibold px-2 py-0.5 rounded-full ml-2">
                  MN
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => setIsDark(!isDark)}
                className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                {isDark ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </nav>

        {/* Main Body */}
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
          {/* Header Banner */}
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-600 dark:text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Зар сурталчилгаагүй, Шууд MP3 / MP4 / WAV Татагч
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              YouTube Аудио & Видео Хөрвүүлэгч
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base">
              Линкээ оруулаад MP3, MP4 эсвэл WAV форматаар шууд хуулж аваарай.
            </p>
          </div>

          {/* Form Card */}
          <div className="max-w-2xl mx-auto">
            <div className="bg-white/80 dark:bg-slate-900/75 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
              <form onSubmit={handleDownload} className="space-y-6">
                {/* Input Box */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    YouTube Бичлэгийн Линк
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute left-4 text-slate-400">
                      <LinkIcon className="w-5 h-5" />
                    </div>
                    <input
                      type="url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="https://www.youtube.com/watch?v=..."
                      required
                      className="w-full pl-12 pr-28 py-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition text-sm font-medium"
                    />
                    <button
                      type="button"
                      onClick={handlePaste}
                      className="absolute right-3 px-3 py-1.5 text-xs font-medium bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 rounded-lg transition text-slate-700 dark:text-slate-300 flex items-center gap-1"
                    >
                      <Clipboard className="w-3.5 h-3.5" />
                      Буулгах
                    </button>
                  </div>
                </div>

                {/* Quality & Format Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                      Формат (Format)
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(["mp3", "mp4", "wav"] as FormatOption[]).map((fmt) => (
                        <button
                          key={fmt}
                          type="button"
                          onClick={() => setFormat(fmt)}
                          className={`px-3 py-2 text-xs font-bold rounded-lg border transition ${
                            format === fmt
                              ? "border-rose-500 bg-rose-500/10 text-rose-600 dark:text-rose-400"
                              : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-400"
                          }`}
                        >
                          {fmt.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                      Чанар (Bitrate / Quality)
                    </label>
                    <select
                      value={bitrate}
                      onChange={(e) =>
                        setBitrate(e.target.value as AudioBitrate)
                      }
                      disabled={format === "mp4"}
                      className="w-full py-2 px-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium focus:ring-2 focus:ring-rose-500 outline-none disabled:opacity-50"
                    >
                      <option value="320">320 kbps (Хамгийн дээд)</option>
                      <option value="256">256 kbps (Өндөр)</option>
                      <option value="192">192 kbps (Дундаж)</option>
                      <option value="128">128 kbps (Стандарт)</option>
                    </select>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-linear-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-rose-500/25 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Боловсруулж байна...</span>
                    </>
                  ) : format === "mp4" ? (
                    <>
                      <Video className="w-5 h-5" />
                      <span>MP4 Видео Татах</span>
                    </>
                  ) : (
                    <>
                      <DownloadCloud className="w-5 h-5" />
                      <span>{format.toUpperCase()} Татах</span>
                    </>
                  )}
                </button>
              </form>

              {/* Error Message */}
              {error && (
                <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-500 text-center font-medium">
                  {error}
                </div>
              )}
            </div>
          </div>

          {/* Features list */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto pt-4">
            <div className="bg-white/80 dark:bg-slate-900/75 border border-slate-200 dark:border-slate-800 p-5 rounded-xl space-y-2">
              <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm">Зар ба Спамгүй</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Байнгын pop-up нээгддэг сурталчилгаа болон аюултай линк байхгүй.
              </p>
            </div>

            <div className="bg-white/80 dark:bg-slate-900/75 border border-slate-200 dark:border-slate-800 p-5 rounded-xl space-y-2">
              <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm">Түргэн Шуурхай</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Ашиглахад хялбар, хурдан шуурхай татаж авах боломжтой.
              </p>
            </div>

            <div className="bg-white/80 dark:bg-slate-900/75 border border-slate-200 dark:border-slate-800 p-5 rounded-xl space-y-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                <Code2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm">MP3 / MP4 / WAV</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Дуу болон бичлэгийг хүссэн форматаараа авах боломжтой.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
