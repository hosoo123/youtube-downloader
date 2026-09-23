import express from "express";
import { exec } from "child_process";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/extract", (req, res) => {
  const { url, format, quality } = req.body; // format: 'mp3' | 'mp4' | 'wav'

  if (!url) {
    return res.status(400).json({ error: "URL шаардлагатай" });
  }

  let formatOption = "";

  if (format === "mp3" || format === "wav") {
    formatOption = '-f "bestaudio/best"';
  } else if (format === "mp4") {
    if (quality === "1080p") {
      formatOption = '-f "bestvideo[height<=1080]+bestaudio/best[height<=1080]"';
    } else if (quality === "720p") {
      formatOption = '-f "bestvideo[height<=720]+bestaudio/best[height<=720]"';
    } else {
      formatOption = '-f "bestvideo+bestaudio/best"';
    }
  }

  const command = `yt-dlp --js-runtimes deno --cookies cookies.txt --no-playlist ${formatOption} -g "${url}"`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error("Exec error:", stderr);
      return res.status(500).json({ error: "Татах линк гаргахад алдаа гарлаа." });
    }
    
    // yt-dlp заримдаа видео + аудио 2 тусдаа линк буцаадаг тул эхний линкийг авна
    const urls = stdout.trim().split("\n");
    const downloadUrl = urls[0];

    res.json({ downloadUrl });
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));