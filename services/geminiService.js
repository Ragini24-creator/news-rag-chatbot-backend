const { searchDocs } = require("./searchService");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const geminiModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

/**
 * Runs RAG pipeline: fetch top-k passages and ask Gemini
 * @param {string} query - User query
 * @returns {string} - Answer from Gemini
 */
async function askGemini(query) {
    try {
        const passages = await searchDocs(query, 10);

        if (passages.length === 0) return "No relevant information found.";

        // Combine top passages, limit total characters to avoid token overflow
        const maxChars = 4000;
        const context = passages
            .map(p => p.content)
            .join("\n\n")
            .slice(0, maxChars);

        const prompt = `
            You are a helpful assistant.
            User query: ${query}

            Relevant passages:
            ${context}

            Please provide a concise and accurate answer using the passages above.
        `;

        const response = await geminiModel.generateContent(prompt);
        const finalAnswer = response.response.candidates[0].content.parts[0].text;

        return finalAnswer || "Gemini did not return a response.";
    } catch (err) {
        console.error("Gemini API error:", err.message || err);
        return "Sorry, I couldn't fetch an answer at the moment.";
    }
}

module.exports = { askGemini };
