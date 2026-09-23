import express from "express";
import { exec } from "child_process";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/extract", (req, res) => {
  const { url, format, quality } = req.body;

  if (!url) {
    return res.status(400).json({ error: "URL шаардлагатай" });
  }

  let formatOption = "";

  if (format === "mp3" || format === "wav") {
    formatOption = '-f "ba/ba*"';
  } else if (format === "mp4") {
    if (quality === "1080p") {
      formatOption = '-f "bv*[height<=1080]+ba/b[height<=1080]/mp4"';
    } else if (quality === "720p") {
      formatOption = '-f "bv*[height<=720]+ba/b[height<=720]/mp4"';
    } else {
      formatOption = '-f "b/bv*+ba"';
    }
  }

  // Хурдасгах аргументууд: --no-warnings --no-call-home --no-check-certificates
  const command = `yt-dlp --js-runtimes deno --cookies cookies.txt --no-warnings --no-call-home --no-check-certificates --no-playlist ${formatOption} -g "${url}"`;

  exec(command, { timeout: 30000 }, (error, stdout, stderr) => {
    if (error) {
      console.error("Exec error:", stderr);
      return res.status(500).json({ error: "Татах линк гаргахад алдаа гарлаа." });
    }
    
    const urls = stdout.trim().split("\n");
    const downloadUrl = urls[0];

    res.json({ downloadUrl });
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));