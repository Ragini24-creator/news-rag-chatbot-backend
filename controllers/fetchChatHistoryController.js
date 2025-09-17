const { getRedisClient } = require('../datastore/redisClient');


/**
 * fetchChatHistoryController
 * 
 * @param {*} req 
 * @param {*} res 
 */
module.exports.fetchChatHistoryController = async function (req, res) {
    try {
        const redis = getRedisClient();
        const { sessionId } = req.params;

        if (!sessionId) {
            return res.status(400).json({ error: "sessionId is required" });
        }

        const items = await redis.lRange(`session:${sessionId}:history`, 0, -1);

        const history = items.map(i => JSON.parse(i));

        res.status(200).json({ sessionId, history });
    } catch (err) {
        console.error(`Error occurred in fetchChatHistoryController :: `, err)

        res.status(500).json({ error: "Internal server error" });
    }
}