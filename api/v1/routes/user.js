import express from 'express';
import userService from  '../services/user.js';
const router = express().router;

router.get('/:userId/chats', userService.getUserChatHistory);

export default router;