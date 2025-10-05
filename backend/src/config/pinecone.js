const { Pinecone } = require('@pinecone-database/pinecone');
let pinecone = null;
const initPinecone = () => {
    if (!pinecone) {
        pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
        console.log('Pinecone client initialized.');
    }
    return pinecone;
};
const getPineconeClient = () => {
    if (!pinecone) throw new Error('Pinecone client has not been initialized.');
    return pinecone;
};
module.exports = { initPinecone, getPineconeClient };