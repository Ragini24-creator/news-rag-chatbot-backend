const { askGemini } = require("../services/geminiService");
const uuid = require("uuid");
const { getRedisClient } = require('../datastore/redisClient')
const SESSION_TTL = Number(process.env.SESSION_TTL || 7 * 24 * 3600);


/**
 * handleChatController
 * 
 * Handles a single chat query from user
 * 
 * @param {Request} req
 * @param {Response} res
 */
module.exports.handleChatController = async function (req, res) {
    try {
        const redis = getRedisClient();
        const { sessionId, query } = req.body;

        if (!query) return res.status(400).json({ error: "Query is required" });

        if (!sessionId) {
            return res.status(400).json({ error: "sessionId is required" });
        }

        const sid = sessionId;

        // Save user message
        const userMsg = { id: uuid.v4(), role: 'user', text: query, ts: Date.now() };
        await redis.rPush(`session:${sid}:history`, JSON.stringify(userMsg));
        await redis.expire(`session:${sid}:history`, SESSION_TTL);

        // Run RAG + Gemini
        const answer = await askGemini(query);

        const botMsg = { id: uuid.v4(), role: 'bot', text: answer, ts: Date.now() };
        await redis.rPush(`session:${sid}:history`, JSON.stringify(botMsg));
        await redis.expire(`session:${sid}:history`, SESSION_TTL);

        return res.status(200).json({ sessionId: sid, answer });

    } catch (err) {
        console.error("Error occurred in handleChatController :: ", err);

        res.status(500).json({ error: "Internal server error" });
    }
}

