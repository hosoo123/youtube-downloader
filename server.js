import express from "express";
import { spawn } from "child_process";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/download", (req, res) => {
  const { url, format, quality } = req.body;

  if (!url) {
    return res.status(400).json({ error: "URL шаардлагатай" });
  }

  const ext = format || "mp3";
  const filename = `youtube-download.${ext}`;

  let formatOption = "best";
  let extraArgs = [];

  // 1. MP3 эсвэл WAV Аудио чанарын тохиргоо
  if (format === "mp3") {
    // quality: 320k (0 - хамгийн сайн), 256k (1), 192k (2), 128k (5)
    let q = "0";
    if (quality === "256k") q = "1";
    if (quality === "192k") q = "2";
    if (quality === "128k") q = "5";

    formatOption = "bestaudio/best";
    extraArgs = ["-x", "--audio-format", "mp3", "--audio-quality", q];
  } else if (format === "wav") {
    formatOption = "bestaudio/best";
    extraArgs = ["-x", "--audio-format", "wav"];
  } 
  // 2. MP4 Видео чанарын тохиргоо (4K, 2K, 1080p, 720p, 480p, 360p)
  else if (format === "mp4") {
    if (quality === "4k") {
      formatOption = "bestvideo[height<=2160]+bestaudio/best[height<=2160]/best";
    } else if (quality === "2k") {
      formatOption = "bestvideo[height<=1440]+bestaudio/best[height<=1440]/best";
    } else if (quality === "1080p") {
      formatOption = "bestvideo[height<=1080]+bestaudio/best[height<=1080]/best";
    } else if (quality === "720p") {
      formatOption = "bestvideo[height<=720]+bestaudio/best[height<=720]/best";
    } else if (quality === "480p") {
      formatOption = "bestvideo[height<=480]+bestaudio/best[height<=480]/best";
    } else if (quality === "360p") {
      formatOption = "bestvideo[height<=360]+bestaudio/best[height<=360]/best";
    } else {
      formatOption = "bestvideo+bestaudio/best";
    }
  }

  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

  if (format === "mp3") res.setHeader("Content-Type", "audio/mpeg");
  else if (format === "wav") res.setHeader("Content-Type", "audio/wav");
  else res.setHeader("Content-Type", "video/mp4");

  const args = [
    "--js-runtimes", "deno",
    "--cookies", "cookies.txt",
    "--no-playlist",
    "-f", formatOption,
    ...extraArgs,
    "-o", "-",
    url
  ];

  const ytdlp = spawn("yt-dlp", args);

  ytdlp.stdout.pipe(res);

  ytdlp.stderr.on("data", (data) => {
    console.error(`yt-dlp error: ${data}`);
  });

  ytdlp.on("close", (code) => {
    if (code !== 0) {
      console.error(`yt-dlp process exited with code ${code}`);
    }
  });

  req.on("close", () => {
    ytdlp.kill();
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));