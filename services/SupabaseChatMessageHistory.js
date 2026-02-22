import { BaseChatMessageHistory } from "@langchain/core/chat_history";
import supabase from '../db/connection.js';
import { AIMessage, HumanMessage } from "langchain";
import helper from '../utils/helper.js';
import dotenv from 'dotenv';
dotenv.config();

export default class SupabaseChatMessageHistory extends BaseChatMessageHistory {
    constructor(chatId, userId) {
        if (!chatId || !userId) {
            throw new Error('Missing chatId or userId');
        }
        super();
        this.userId = userId;
        this.chatId = chatId;
    }

    async getMessages() {
        try {
            const { data, error } = await supabase
                .from('chat_history')
                .select('*')
                .eq('chat_id', this.chatId)
                .order('created_at', { ascending: true });
            return data;
        } catch (error) {
            console.error("Error fetching messages from SupabaseChatMessageHistory:", error);
            throw error;
        }
    }

    async addMessage(transformedMessage, originalMessage, llmTokenUsage = null) {
        try {
            const messageType = transformedMessage._getType();
            const response = await helper.generateEmbeddings(originalMessage);
            const data = {
                user_id: this.userId,
                chat_id: this.chatId,
                type: messageType,
                content: transformedMessage.content,
                embedding: response.data[0].embedding,
                tokens: response.usage.total_tokens,
                llm_model: process.env.LLM_MODEL,
            }

            if (llmTokenUsage && messageType === 'ai') {
                data.tokens = llmTokenUsage.output_tokens;
            } else if (llmTokenUsage && messageType === 'human') {
                data.tokens = llmTokenUsage.input_tokens;
            }
            const { error } = await supabase
                .from('chat_history')
                .insert(data);

            if (error) {
                throw error;
            }
        } catch (error) {
            console.error("Error adding message to SupabaseChatMessageHistory:", error);
            throw error;
        }
    }

    async addAIMessage(message, llmTokenUsage = null) {
        try {
            let transformedAiMessage = new AIMessage(message);
            await this.addMessage(transformedAiMessage, message, llmTokenUsage);
        } catch (error) {
            console.error("Error adding AI message to SupabaseChatMessageHistory:", error);
            throw error;
        }
    }

    async addUserMessage(message, llmTokenUsage = null) {
        try {
            let transformedUserMessage = new HumanMessage(message);
            await this.addMessage(transformedUserMessage, message, llmTokenUsage);
        } catch (error) {
            console.error("Error adding user message to SupabaseChatMessageHistory:", error);
            throw error;
        }
    }
}