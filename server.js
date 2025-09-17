const express = require("express")
const dotenv = require("dotenv")
const cors = require("cors")

dotenv.config()

const { initializeQdrantClient } = require('./datastore/qdrantConnection');
const routes = require('./routes/chatRoutes.js')
const { initializeRedisClient } = require('./datastore/redisClient.js')

const app = express()

app.use(cors({
    origin: [
        "https://newsmind-ui.onrender.com", // your deployed frontend
        "http://localhost:3000"             // for local dev
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true
}));

app.use(express.json())
app.use("/api", routes)


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
    try {
        initializeQdrantClient();
        await initializeRedisClient();

        console.log(`Server running on port ${PORT}`);
    } catch (err) {
        console.error(`Error occurred while starting Rag News Chatbot App :: ${JSON.stringify(err)}`)

        process.exit(1);
    }
});