const fs = require("fs");
const { getEmbeddings } = require("./embeddingService");
const uuid = require("uuid");
const { getQdrantClient } = require("../datastore/qdrantConnection");
const { truncateByWords } = require('../utils/rssUtils')



/**
 * insertDocs
 * 
 * Inserts documents into Qdrant with Jina embeddings
 * 
 * @param {string} collectionName - Qdrant collection name
 * @param {Array<{id?: string|number, text: string, metadata?: object}>} docs
 * 
 */
async function insertDocs(collectionName, docs) {
    const client = getQdrantClient();
    // const docs = getArticles();

    // Generate embeddings for all documents
    const vectors = [];
    for (const doc of docs) {
        const truncatedContent = truncateByWords(doc.content, 6000);
        const cleanContent = truncatedContent.replace(/<[^>]+>/g, '');
        const embedding = await getEmbeddings(cleanContent);



        if (!embedding) {
            console.error(`Skipping doc due to embedding failure: ${cleanContent}`);
            continue;
        }

        vectors.push({
            id: uuid.v4(), // Use article URL as unique ID, or let Qdrant auto-generate
            vector: embedding,             // 1024-dim Jina embedding
            payload: {
                title: doc.title,          // store article title
                content: truncatedContent,      // store article content
                url: doc.url               // store original URL
            },
        });
    }

    if (vectors.length === 0) {
        console.log("No valid embeddings to insert.");
        return;
    }

    // Insert into Qdrant
    await client.upsert(collectionName, {
        points: vectors,
    });

    console.log(`Inserted ${vectors.length} documents into ${collectionName}`);
}

module.exports = { insertDocs };



