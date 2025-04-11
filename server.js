const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const OpenAI = require("openai");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const systemPrompt = `You are a helpful assistant that explains the AI Automation Mastery course. The course teaches people how to master AI automations to integrate them inside businesses. Explain modules, who it’s for, what results they can expect, and answer objections like "I'm not technical" or "I don’t have time." Be warm, helpful, and expert.`;

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage }
      ]
    });

    const reply = completion.choices[0].message.content;
    res.json({ reply });
  } catch (err) {
    console.error("OpenAI error:", err);
    res.status(500).send("Error communicating with OpenAI.");
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "public", "index.html"));
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server is running on port 3000");
});
