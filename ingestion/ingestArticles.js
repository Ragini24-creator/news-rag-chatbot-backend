const { fetchUrls } = require("../utils/rssUtils");
const { fetchArticles } = require("../services/fetchArticles");
const fs = require("fs");

const ingestArticles = async function () {
    try {
        const rssUrl = "https://feeds.bbci.co.uk/news/rss.xml";
        const urls = await fetchUrls(rssUrl)

        let articles = []

        for (const url of urls) {
            const article = await fetchArticles(url);
            if (article) {
                articles.push(article);
            }
        }

        fs.writeFileSync("articles.json", JSON.stringify(articles, null, 2));
        console.log(`Saved ${articles.length} articles`);

    } catch (err) {
        console.log("Error in ingestion", err.message);
    }

}

ingestArticles();