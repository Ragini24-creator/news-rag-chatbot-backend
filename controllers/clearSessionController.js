const { getRedisClient } = require('../datastore/redisClient')

/**
 * clearSessionController
 * 
 * @param {*} req 
 * @param {*} res 
 */
module.exports.clearSessionController = async function (req, res) {
    try {
        const redis = getRedisClient();
        const { sessionId } = req.params;

        if (!sessionId) {
            return res.status(400).json({ error: "sessionId is required" });
        }

        await redis.del(`session:${sessionId}:history`);

        await redis.del(`session:${sessionId}:meta`);

        res.status(200).json({ status: 'SUCCESS' });
    } catch (err) {
        console.error(`Error occurred in clearSessionController :: `, err)

        res.status(500).json({ error: "Internal server error" });
    }
}