class ChatMemory {
    #map = new Map();
    addToChatHistory(chatId, role, content) {
        try {
            if (!chatId) throw new Error('ChatId Id is missing');
            const history = this.#map.get(chatId) || [];
            history.push({ role, content });
            this.#map.set(chatId, history);
        } catch (error) {
            throw error;
        }
    }

    getChatHistory(chatId) {
        try {
            if (!chatId) throw new Error('ChatId Id is missing');
            const history = this.#map.get(chatId) || [];
            return history;
        } catch (error) {
            throw error;
        }
    }

    saveContext(chatId, inputObj, outputObj) {
        try {
            if (!chatId) throw new Error('ChatId Id is missing');
            const history = this.#map.get(chatId) || [];
            if (inputObj) history.push({ role: inputObj.role, content: inputObj.content });
            if (outputObj) history.push({ role: outputObj.role, content: outputObj.content });
            this.#map.set(chatId, history);
        } catch (error) {
            throw error;
        }
    }
}

const chatHistory = new ChatMemory();
export default chatHistory;