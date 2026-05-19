import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenAI(process.env.GEMINI_API_KEY || "");

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route: AI Learning Strategy
  app.post("/api/ai-strategy", async (req, res) => {
    try {
      const { currentQuests, notes } = req.body;
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      
      const prompt = `
        Anda adalah AI Mentor di aplikasi 'LevelUp'.
        User sedang mengerjakan tugas-tugas berikut: ${JSON.stringify(currentQuests)}.
        Catatan tambahan mereka: "${notes}".
        
        Berikan 3 saran strategi belajar/habit yang singkat, padat, dan sangat memotivasi dalam Bahasa Indonesia. 
        Gunakan gaya bahasa seorang Game Director yang menyemangati pemain. 
        Format dalam poin-poin sederhana.
      `;

      const result = await model.generateContent(prompt);
      const advice = result.response.text();
      res.json({ advice });
    } catch (error) {
      console.error("AI Error:", error);
      res.status(500).json({ error: "Gagal mendapatkan saran AI." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`LevelUp Engine running on http://localhost:${PORT}`);
  });
}

startServer();
