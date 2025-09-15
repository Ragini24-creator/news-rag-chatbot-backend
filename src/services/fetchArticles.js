const axios = require("axios");
const cheerio = require("cheerio");

const fetchArticles = async function (url) {
    try {
        const response = await axios.get(url)
        const $ = cheerio.load(response.data)

        const title = $("h1").text()
        const content = $("article").text()

        return { url, title, content }
    } catch (err) {
        console.log("Error fetching article", url, err.message);
        return null;
    }
}


module.exports = { fetchArticles };