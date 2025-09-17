const { fetchUrls, fetchArticles } = require("../utils/rssUtils");


module.exports.fetchRssArticles = async function () {
    try {
        // const rssUrl = "https://feeds.bbci.co.uk/news/rss.xml";
        const rssUrl = "https://www.indiatoday.in/rss/1206578";
        const urls = await fetchUrls(rssUrl, 25)

        let articles = [];

        for (const url of urls) {
            const article = await fetchArticles(url);
            if (article) {
                articles.push(article);
            }
        }

        return articles;

    } catch (err) {
        console.log("Error in ingestion", err.message);
    }

}