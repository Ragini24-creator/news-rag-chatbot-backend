const Parser = require("rss-parser");
const parser = new Parser()

const fetchUrls = async function (rssUrl, limit = 50) {
    const feed = await parser.parseURL(rssUrl);

    console.log("rssFetcher", feed);

    const urls = feed.items.slice(0, limit).map(item => item.link);
    return urls;
}

module.exports = { fetchUrls };