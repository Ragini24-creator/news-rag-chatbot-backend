const { createClient } = require("redis");

let redisClient;


module.exports.initializeRedisClient = async function () {
    redisClient = createClient({
        username: process.env.REDIS_USERNAME,
        password: process.env.REDIS_PASSWORD,
        socket: {
            host: process.env.REDIS_HOST,
            port: process.env.REDIS_PORT,
            reconnectStrategy: (retries) => {
                if (retries > 10) {
                    console.error("Too many retries, giving up.");

                    return new Error("Retry limit reached");
                }
                // exponential backoff with max cap of 3s
                return Math.min(retries * 100, 3000);
            },
        },
    });

    redisClient.on("ready", () => {
        console.log("Redis connection established and ready to use!");
    });

    redisClient.on("error", (err) => {
        console.error("Redis Client Error:", err);

        throw err;
    });

    await redisClient.connect();
}


module.exports.getRedisClient = function () {
    return redisClient;
}
