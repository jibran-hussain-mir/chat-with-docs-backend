import { ChatOpenAI } from "@langchain/openai";
import 'dotenv/config';

export default class ChatModel {
    #apiKey = {
        openai: process.env.OPENAI_API_KEY
    }

    #initializeModel = {
        openai: (options) => new ChatOpenAI(options)
    }

    constructor(modelInfo = {}) {
        const { provider = 'openai', model = 'gpt-4.1', temperature = 0.2, timeout = 30, maxRetries = 3, ...otherModelInfo } = modelInfo;
        if (!provider || !this.#apiKey[provider]) throw new Error('Model provider is missing or invalid');
        const initializeModelOptions = {
            provider: provider,
            model: model,
            temperature: temperature,
            timeout: timeout * 1000,
            maxRetries: maxRetries,
            apiKey: this.#apiKey[provider],
            ...otherModelInfo
        }
        this.model = this.#initializeModel[provider](initializeModelOptions);
    }

    async getInstantResponse(messages) {
        try {
            const response = await this.model.invoke(messages);
            return response;
        } catch (error) {
            console.log('Error in getInstantResponse method', error);
            throw new Error(`Failed to generate response: ${error.message}`);
        }
    }

    async getStreamedResponse(messages) {
        try {
            return await this.model.stream(messages);
        } catch (error) {
            console.log('Error in getStreamedResponse method', error);
            throw new Error(`Failed to generate streamed response: ${error.message}`);
        }
    }

}