const { QdrantClient } = require("@qdrant/js-client-rest");

let client = null;

const initializeQdrantClient = function () {
    client = new QdrantClient({
        url: process.env.QDRANT_URL,
        apiKey: process.env.QDRANT_API_KEY
    });
}

const getQdrantClient = function () {
    if (!client) throw new Error("Qdrant client not initialized");
    return client;
}


async function setupCollection(collectionName, vectorSize = 1024) {
    const existingCollections = await client.getCollections();
    if (!existingCollections.collections.find(c => c.name === collectionName)) {
        await client.createCollection(collectionName, {
            vectors: {
                size: vectorSize,
                distance: "Cosine",
            },
        });
        console.log(`Collection created: ${collectionName}`);
    } else {
        console.log(`Collection already exists: ${collectionName}`);
    }
}

module.exports = { initializeQdrantClient, getQdrantClient, setupCollection }