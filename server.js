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

  // Файлын өextension болон нэрийг тохируулах
  const ext = format || "mp3";
  const filename = `youtube-download.${ext}`;

  let formatOption = "best";

  if (format === "mp3" || format === "wav") {
    formatOption = "bestaudio/best";
  } else if (format === "mp4") {
    if (quality === "1080p") {
      formatOption = "bestvideo[height<=1080]+bestaudio/best[height<=1080]/best";
    } else if (quality === "720p") {
      formatOption = "bestvideo[height<=720]+bestaudio/best[height<=720]/best";
    } else {
      formatOption = "bestvideo+bestaudio/best";
    }
  }

  // Браузерт заавал файл болгож татуулах Header өгнө
  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
  
  if (format === "mp3") res.setHeader("Content-Type", "audio/mpeg");
  else if (format === "wav") res.setHeader("Content-Type", "audio/wav");
  else res.setHeader("Content-Type", "video/mp4");

  // yt-dlp-г stdout руу шууд дамжуулахаар spawn хийнэ (-o -)
  const args = [
    "--js-runtimes", "deno",
    "--cookies", "cookies.txt",
    "--no-playlist",
    "-f", formatOption,
    "-o", "-",
    url
  ];

  const ytdlp = spawn("yt-dlp", args);

  // Файлыг сервер рүү шууд Stream хийж дамжуулна
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