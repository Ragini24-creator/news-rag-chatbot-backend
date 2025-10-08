# NewsMind - A RAG News Chatbot - Backend

This repository contains the backend implementation of a Retrieval-Augmented Generation (RAG) chatbot that answers queries over a news corpus using **Jina embeddings**, **Qdrant vector store**, **Google Gemini API**, and **Redis for session management**.

## 🛠️ Tech Stack & Justification

| Component            | Choice & Justification |
|----------------------|----------------------|
| **Embeddings**       | **Jina Embeddings (free tier)** – Lightweight, easy to integrate with Node.js, provides good-quality vector representations for text content. Truncated articles to 6000 words to comply with token limits. |
| **Vector DB**        | **Qdrant** – Open-source, high-performance vector database. Supports similarity search over embeddings and integrates seamlessly with Node.js. |
| **LLM API**          | **Google Gemini** – Provides concise, accurate responses over retrieved passages. Free trial available for development/testing. |
| **Backend**          | **Node.js + Express** – Lightweight, fast, and ideal for building REST APIs. Easy integration with Redis and external APIs. |
| **Cache & Sessions** | **Redis (in-memory)** – Stores session history per user. Fast read/write, supports TTL, and handles multiple sessions efficiently. |

## ⚡ Features

- RAG pipeline to ingest ~50 news articles (RSS feeds or scraped HTML)
- Embedding of articles and storage in Qdrant
- Retrieval of top-k relevant passages per query
- LLM response generation via Gemini API
- Session-based chat with Redis caching
- Clear session functionality
- API endpoints for:
  - Creating a session
  - Sending queries and receiving answers
  - Fetching chat history
  - Clearing a session

## 📂 Project Structure

```bash
backend/
├─ server.js
├─ routes/
│  └─ chatRoutes.js
├─ controllers/
│  ├─ chatController.js
│  └─ clearSessionController.js
|  └─ createSessionController.js
|  └─ fetchSessionController.js
├─ services/
│  ├─ embeddingService.js
│  ├─ fetchArticleService.js
│  ├─ geminiService.js
│  ├─ insertDocs.js
│  ├─ searchService.js
├─ datastore/
│  ├─ qdrantConnection.js
│  └─ redisClient.js
├─ pipelines/
│  └─ ingestionPipeline.js
├─ utils/
│  └─ rssUtils.js
├─ .env
├─ .gitignore
└─ package.json
```

## 🚀 Setup

1. Clone the repository

```bash
git clone <backend-repo-url>
```

2. Install dependencies

```bash
npm install
```

3. Create .env file with:

```env
PORT=<port>
JINA_API_KEY=<your_jina_api_key>
GEMINI_API_KEY=<your_gemini_api_key>
QDRANT_API_KEY=<qdrant_api_key>
QDRANT_URL=<qdrant_url>
REDIS_HOST=<redis_host>
REDIS_PORT=<redis_port>
REDIS_USERNAME=<username_if_required>
REDIS_PASSWORD=<password_if_required>
```

4. Start server

```bash
node server.js
```

## API Endpoints

| Method | Endpoint                      | Description                                                            |
|--------|-------------------------------|------------------------------------------------------------------------|
| POST   | /api/users/session/create     | Create a new session and return `sessionId`                            |
| POST   | /api/users/chat               | Send query with `{ sessionId, query }`, return `{ sessionId, answer }` |
| GET    | /api/users/history/:sessionId | Get chat history for the session                                       |
| DELETE | /api/users/session/:sessionId | Clear chat history and metadata for the session                        |


### ⚙️ Notes

- **Embedding truncation:** Article content is truncated to 6000 words to comply with Jina token limits.  
- **Session handling:** Each user session is stored in Redis. History is persisted per `sessionId`.  
- **Vector search:** Top-k passages are retrieved from Qdrant for each user query before calling Gemini.  
- **Error handling:** Robust handling for missing `sessionId`, API failures, and connection issues.

## 🕒 TTL and ⚡ Cache Warming

### TTL (Time-to-Live)
- A **7-day TTL** is already implemented for each chat session in Redis.  
- This ensures old sessions are automatically cleaned up without manual intervention, preventing unbounded memory growth.  

**Code (already implemented):**
```js
// Store session history with 7-day TTL (in seconds)
await redisClient.set(sessionId, JSON.stringify(chatHistory), "EX", 7 * 24 * 60 * 60);

```

### ⚡ Cache Warming

To ensure faster responses for frequently accessed content (like FAQs or trending articles), we can proactively “warm” the cache at startup.

**Example (conceptual):**
```js
async function warmCache() {
  const popularQueries = ["India news", "AI trends", "Stock market today"];

  for (const query of popularQueries) {
    const answer = await runRagPipeline(query); 
    await redis.set(`cache:${query}`, answer, "EX", 86400); // keep for 1 day
  }
}

```

### 💡 Potential Improvements

- Implement streaming responses from Gemini for real-time typing effect.  
- Persist all chat transcripts to SQL/NoSQL for analytics.  
- Support multiple embedding models for better retrieval.  
- Add authentication for multi-user support.

###  🧠 Sample Data

For testing or demo purposes, a small set of news snippets has been added in the file 

```sample_qdrant_data.txt```

You can use this file to understand the kind of content the chatbot retrieves and responds to.
(Note: The actual deployed version uses a larger corpus stored in Qdrant for semantic search.)
