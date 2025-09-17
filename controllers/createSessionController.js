const uuid = require('uuid');
const { getRedisClient } = require('../datastore/redisClient')

const SESSION_TTL = Number(process.env.SESSION_TTL || 7 * 24 * 3600);

/**
 * createSessionController
 * 
 * Creates a new sessionId and stores associated metadata in Redis server
 * 
 * @param {Object} req Request Object
 * @param {Object} res Response Object
 * 
 * @returns {object} Session Id
 */
module.exports.createSessionController = async function (req, res) {
    try {
        const redis = getRedisClient();
        const sessionId = uuid.v4();

        await redis.hSet(`session:${sessionId}:meta`, { createdAt: Date.now() });

        await redis.expire(`session:${sessionId}:meta`, SESSION_TTL);

        return res.status(200).json({ sessionId });
    } catch (err) {
        console.error(`Error occurred in createSessionController :: `, err)

        res.status(500).json({ error: "Internal server error" });
    }
}