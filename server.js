import express from "express";
import { spawn } from "child_process";
import cors from "cors";
import fs from "fs";
import path from "path";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/download", (req, res) => {
  const { url, format, quality } = req.body;

  if (!url) {
    return res.status(400).json({ error: "URL шаардлагатай" });
  }

  const ext = format || "mp3";
  const uniqueId = Date.now();
  const outputTemplate = path.join("/tmp", `video-${uniqueId}.%(ext)s`);

  let args = [
    "--js-runtimes",
    "deno",
    "--remote-components",
    "ejs:github",
    "--no-playlist",
  ];

  if (fs.existsSync("cookies.txt")) {
    args.push("--cookies", "cookies.txt");
  }

  if (format === "mp3") {
    let q = "5";
    if (quality === "320k") q = "0";
    else if (quality === "256k") q = "1";
    else if (quality === "192k") q = "2";
    else if (quality === "128k") q = "5";

    args.push(
      "-f",
      "bestaudio/best",
      "-x",
      "--audio-format",
      "mp3",
      "--audio-quality",
      q,
    );
  } else if (format === "wav") {
    args.push("-f", "bestaudio/best", "-x", "--audio-format", "wav");
  } else if (format === "mp4") {
    let formatOption = "bestvideo+bestaudio/best";
    if (quality === "4k")
      formatOption =
        "bestvideo[height<=2160]+bestaudio/best[height<=2160]/best";
    else if (quality === "2k")
      formatOption =
        "bestvideo[height<=1440]+bestaudio/best[height<=1440]/best";
    else if (quality === "1080p")
      formatOption =
        "bestvideo[height<=1080]+bestaudio/best[height<=1080]/best";
    else if (quality === "720p")
      formatOption = "bestvideo[height<=720]+bestaudio/best[height<=720]/best";
    else if (quality === "480p")
      formatOption = "bestvideo[height<=480]+bestaudio/best[height<=480]/best";
    else if (quality === "360p")
      formatOption = "bestvideo[height<=360]+bestaudio/best[height<=360]/best";

    args.push("-f", formatOption, "--merge-output-format", "mp4");
  }

  args.push("-o", outputTemplate, url);

  console.log(`Starting yt-dlp with args:`, args);

  const ytDlpProcess = spawn("yt-dlp", args);

  let stderrData = "";

  ytDlpProcess.stderr.on("data", (data) => {
    stderrData += data.toString();
  });

  ytDlpProcess.on("close", (code) => {
    if (code !== 0) {
      console.error(`yt-dlp error: ${stderrData}`);
      return res.status(500).json({ error: "Татахад алдаа гарлаа." });
    }

    fs.readdir("/tmp", (err, files) => {
      if (err) {
        return res.status(500).json({ error: "Файл уншихад алдаа гарлаа." });
      }

      const downloadedFile = files.find((f) =>
        f.startsWith(`video-${uniqueId}`),
      );

      if (!downloadedFile) {
        return res.status(404).json({ error: "Файл олдсонгүй." });
      }

      const filePath = path.join("/tmp", downloadedFile);
      const stat = fs.statSync(filePath);

      res.setHeader("Content-Length", stat.size);
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="youtube-${uniqueId}.${ext}"`,
      );

      if (format === "mp3") res.setHeader("Content-Type", "audio/mpeg");
      else if (format === "wav") res.setHeader("Content-Type", "audio/wav");
      else res.setHeader("Content-Type", "video/mp4");

      const readStream = fs.createReadStream(filePath);
      readStream.pipe(res);

      readStream.on("end", () => {
        fs.unlink(filePath, () => {});
      });

      readStream.on("error", (streamErr) => {
        console.error(streamErr);
        res.status(500).json({ error: "Файл илгээхэд алдаа гарлаа." });
      });
    });
  });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
