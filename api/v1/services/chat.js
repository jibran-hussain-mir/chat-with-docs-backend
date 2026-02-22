import { nanoid } from 'nanoid';
import { ChatOpenAI } from "@langchain/openai";
import { InMemoryChatMessageHistory } from "@langchain/core/chat_history";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import SupabaseChatMessageHistory from "../../../services/SupabaseChatMessageHistory.js";
import supabase from '../../../db/connection.js';
import ChatModel from '../../../services/ChatModel.js';
import dotenv from 'dotenv';
dotenv.config();

async function answerUsersQuestion(req, res) {
  try {
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Transfer-Encoding', 'chunked');

    const chatId = req.body.chatId;
    const userId = req.body.userId || 4; // Later take it from the token
    const question = req.body?.question || "What is Langchain?";

    if (!userId || !chatId || !question) {
      return res.status(400).json({ msg: 'Missing chatId or question' });
    }

    const abortController = new AbortController();
    let isRequestAborted = false;

    const chatSession = new SupabaseChatMessageHistory(chatId, userId);

    // Get previous messages
    const previousMessages = await chatSession.getMessages();

    req.on('close', () => {
      abortController.abort();
      isRequestAborted = true;
    });

    const model = new ChatModel({
      provider: process.env.LLM_MODEL_PROVIDER,
      model: process.env.LLM_MODEL,
    });

    // Prepare messages array (previous + current)
    const messages = [...previousMessages, new HumanMessage(question)];

    let fullResponse = '';
    let tokenUsage = null;

    // Stream the response
    const stream = await model.getStreamedResponse(messages);

    for await (const chunk of stream) {
      if (isRequestAborted) {
        break;
      }
      const content = chunk.content || '';
      fullResponse += content;
      res.write(content);

      // The final chunk carries usage_metadata with token counts
      if (chunk.usage_metadata) {
        tokenUsage = chunk.usage_metadata;
      }
    }


    // Add user message to history
    await chatSession.addUserMessage(question, tokenUsage);

    // Save assistant response to history (with LLM token usage)
    await chatSession.addAIMessage(fullResponse, tokenUsage);

    res.end();
  } catch (error) {
    console.log('Error in answerUsersQuestion method', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

async function createChatId(req, res) {
  try {
    const chatId = nanoid();
    // After implementing auth, remove the hardcoded values
    const { error } = await supabase
      .from('chats')
      .insert({ chat_id: chatId, chat_title: 'New Chat', user_id: 4, created_by: 'mirjibranhussain@gmail.com' });
    if (error) {
      throw error;
    };
    return res.status(201).json({ chatId: chatId });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
    console.log('Error in createChatId method', error);
  }
}

const chatService = {
  answerUsersQuestion: answerUsersQuestion,
  createChatId: createChatId
};

export default chatService;