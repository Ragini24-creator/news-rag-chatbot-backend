const { askGemini } = require("../services/geminiService");
const { v4: uuidv4 } = require("uuid");
// const { getRedisClient } = require("../datastore/redisConnection"); // optional Redis for session/history

/**
 * Handles a single chat query from user
 * @param {Request} req
 * @param {Response} res
 */
async function handleChat(req, res) {
    try {
        const { query } = req.body;

        if (!query) return res.status(400).json({ error: "Query is required" });

        // Generate a sessionId if not provided
        // const userSession = sessionId || uuidv4();

        // Optional: save user query to Redis session
        // const redisClient = getRedisClient();
        // if (redisClient) {
        //     await redisClient.lPush(`session:${userSession}`, JSON.stringify({ role: "user", content: query }));
        // }

        // Run RAG + Gemini
        const answer = await askGemini(query);

        // Optional: save bot response to Redis session
        // if (redisClient) {
        //     await redisClient.lPush(`session:${userSession}`, JSON.stringify({ role: "bot", content: answer }));
        // }

        return res.json({ answer });
    } catch (err) {
        console.error("Chat error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
}

module.exports = { handleChat };
