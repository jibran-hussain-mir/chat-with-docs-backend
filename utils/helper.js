import fs from "fs/promises";
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

export default {
    splitTextIntoChunks: splitTextIntoChunks
}

