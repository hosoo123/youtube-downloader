import express from "express";
import { exec } from "child_process";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/extract", (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "URL шаардлагатай" });
  }

  // Render дээр үүссэн cookies.txt-ийг зааж өгнө
  const command = `yt-dlp --js-runtimes deno --cookies cookies.txt --no-playlist -g -f "bestaudio/best" "${url}"`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error("Exec error:", stderr);
      return res.status(500).json({
        error: "Аудио линк гаргахад алдаа гарлаа.",
        details: stderr,
      });
    }
    const downloadUrl = stdout.trim();
    res.json({ downloadUrl });
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
