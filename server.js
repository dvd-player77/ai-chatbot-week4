// Gemini Proxy Server (Node 24+ compatible)
process.on("uncaughtException", (err) => {
    console.error("UNCAUGHT EXCEPTION:", err);
});

process.on("unhandledRejection", (reason) => {
    console.error("UNHANDLED REJECTION:", reason);
});

const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Your Gemini API key
const GEMINI_API_KEY = "YOUR_GEMINI_API_KEY_HERE"; // Replace with your actual Gemini API key

// POST endpoint for your chatbot
app.post("/gemini", async (req, res) => {
    const userMessage = req.body.message;

    try {
        const response = await fetch(
            "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=" + GEMINI_API_KEY,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [
                        {
                            role: "user",
                            parts: [
                                { text: "You are a music recommendation assistant." },
                                { text: userMessage }
                            ]
                        }
                    ]
                })
            }
        );

        const data = await response.json();
        res.json(data);

    } catch (error) {
        console.error("Gemini error:", error);
        res.status(500).json({ error: "Gemini request failed", details: error });
    }
});

// Bind to all interfaces (fixes macOS networking issues)
app.listen(3000, "0.0.0.0", () => {
    console.log("Gemini proxy server running on http://localhost:3000");
});
