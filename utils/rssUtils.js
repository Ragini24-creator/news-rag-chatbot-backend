const Parser = require("rss-parser");
const axios = require("axios");
const cheerio = require("cheerio");
const parser = new Parser()


const fetchUrls = async function (rssUrl, limit = 50) {
    const feed = await parser.parseURL(rssUrl);

    console.log("rssFetcher", feed);

    const urls = feed.items.slice(0, limit).map(item => item.link);
    return urls;
}

const fetchArticles = async function (url) {
    try {
        const response = await axios.get(url)
        const $ = cheerio.load(response.data)

        const title = $("h1").text()
        const content = $("article").text()

        return { url, title, content }
    } catch (err) {
        throw new Error(`Failed to fetch an article :: ${err}`)
    }
}


/**
 * truncateByWords
 * 
 * Truncate text to a maximum number of words
 * 
 * @param {string} text - Original text
 * @param {number} maxWords - Maximum allowed words
 * 
 * @returns {string} - Truncated text
 */
function truncateByWords(text, maxWords = 6000) {
    const words = text.split(/\s+/);  // split by spaces
    if (words.length <= maxWords) return text;
    return words.slice(0, maxWords).join(" ");
}

module.exports = { fetchUrls, fetchArticles, truncateByWords };