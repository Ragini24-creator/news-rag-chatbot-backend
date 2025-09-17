const { fetchRssArticles } = require('../services/fetchArticleService');
const { insertDocs } = require('../services/insertDocs');
const { initializeQdrantClient } = require('../datastore/qdrantConnection')

async function executeInjestionPipeline() {
    try {
        initializeQdrantClient();
        const articles = await fetchRssArticles();
        await insertDocs('news_chatbot', articles);
    } catch (err) {
        console.error(`Error occured while executing injestion pipeline :: ${err}`)

        process.exit(1);
    }
}

executeInjestionPipeline();