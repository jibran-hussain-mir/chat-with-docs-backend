import express from 'express';
import chatService from '../services/chat.js'

const router = express().router;

router.post('/question', chatService.answerUsersQuestion);
router.post('/id', chatService.createChatId);

export default router;