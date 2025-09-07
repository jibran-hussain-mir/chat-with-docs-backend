import fs from "fs/promises";
import { OpenAIEmbeddings } from "@langchain/openai";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

async function createSplitter(splittingType, options) {
    try {
        switch (splittingType) {
            case 'recursiveCharacter':
                return new RecursiveCharacterTextSplitter(options);
            default:
                throw new Error(`Unsupported splitting type: ${splittingType}`);
        }
    } catch (error) {
        throw new Error(`Failed to create text splitter: ${error.message}`);
    }
}

async function splitTextIntoChunks(splittingType = 'recursiveCharacter', options) {
    try {
        const { filePath } = options;
        if (!filePath) throw new Error("File path is required");
        const text = await fs.readFile(filePath, "utf-8");

        const textSplitter = await createSplitter(splittingType, options)
        const chunks = await textSplitter.splitText(text);
        return chunks;
    } catch (error) {
        throw new Error(`Failed to split text: ${error.message}`);
    }
}

async function generateEmbeddings(text) {
    try {
        const embeddings = new OpenAIEmbeddings({
            apiKey: process.env.OPENAI_API_KEY,
            modelName: 'text-embedding-3-small' // Later change it to large for the difference in results
        })
        const response = await embeddings.embedQuery("Hello world");
        return response;
    } catch (error) {
        throw new Error(`Failed to generate embeddings: ${error.message}`);
    }
}

export default {
    splitTextIntoChunks: splitTextIntoChunks,
    generateEmbeddings: generateEmbeddings
}

