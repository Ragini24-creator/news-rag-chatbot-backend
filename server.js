const express = require("express")
const dotenv = require("dotenv")
const cors = require("cors")

dotenv.config()

const { fetchRssArticles } = require('./services/fetchArticleService.js')
const { initializeQdrantClient, setupCollection } = require('./datastore/qdrantConnection');
const { insertDocs } = require('./services/insertDocs.js');
const routes = require('./routes/chatRoutes.js')

const app = express()

app.use(cors())
app.use(express.json())
app.use("/api", routes)


// Start server
const PORT = 5000;
app.listen(PORT, async () => {
    try {
        initializeQdrantClient();
        // await setupCollection("news_chatbot", 1024)
        // const articles = await fetchRssArticles();
        // await insertDocs('news_chatbot', articles);

        console.log(`Server running on port ${PORT}`);
    } catch (err) {
        console.error(`Error occurred while starting Rag News Chatbot App :: ${JSON.stringify(err)}`)

        process.exit(1);
    }
});