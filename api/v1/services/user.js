import supabase from "../../../db/connection.js";

async function getUserChatHistory(req, res) {
    try {
        const limit = req.query.limit || 10;
        const offset = req.query.offset || 0;
        const userId = req.params.userId;

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        // Check if he is asking for his own chats only
        const { data: resp, error } = await supabase
            .from('users')
            .select('email')
            .eq('user_id', userId);

        if(error) {
            throw error;
        }

        if(!resp.length) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { data, err } = await supabase
            .from('chats')
            .select('chat_id, chat_title')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

            if(err) {
                throw err;
            }

        return res.status(200).json({ chats: data });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

const userService = {
    getUserChatHistory: getUserChatHistory
}

export default userService;