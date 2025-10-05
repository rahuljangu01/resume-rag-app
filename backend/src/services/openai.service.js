
let pipeline, extractor, questionAnswerer;

const EMBEDDING_DIMENSIONS = 384; 

async function initializeModels() {
    if (!pipeline) {
        console.log('Initializing local AI models (this may take a moment on first run)...');
        const transformers = await import('@xenova/transformers');
        pipeline = transformers.pipeline;

        extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
        questionAnswerer = await pipeline('question-answering', 'Xenova/distilbert-base-cased-distilled-squad');
        
        console.log('Local AI models loaded successfully.');
    }
}

const getEmbedding = async (text) => {
    if (!extractor) {
        throw new Error("Embedding model is not initialized. Please wait and try again.");
    }
    try {
        const output = await extractor(text, { pooling: 'mean', normalize: true });
        return Array.from(output.data);
    } catch (error) {
        console.error("Local Embedding Error:", error);
        throw new Error("Failed to generate text embedding.");
    }
};

const getQueryAnswer = async (context, query) => {
    if (!questionAnswerer) {
        throw new Error("QA model is not initialized. Please wait and try again.");
    }
    try {
        const result = await questionAnswerer(query, context);
        
        if (result.score < 0.1) { 
            return "The answer is not available in the provided resumes.";
        }
        return result.answer;

    } catch (error) {
        console.error("Local QA Error:", error);
        throw new Error("AI model se jawaab nahi mil paaya.");
    }
};

module.exports = { 
    initializeModels, 
    getEmbedding, 
    getQueryAnswer, 
    EMBEDDING_DIMENSIONS 
};