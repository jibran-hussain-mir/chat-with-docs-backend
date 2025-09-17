import express from 'express';
import passport from 'passport';
import { nanoid } from 'nanoid';
import supabase from '../../../db/connection.js'

const router = express.Router();

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], accessType: 'offline', prompt: 'consent' }));

router.get('/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: '/' }),
    async function (req, res) {
        try {
            console.log(req.user)
            res.cookie('token', req.user.jwtToken, {
                httpOnly: true,
                // secure: true,
                sameSite: 'strict'
            })
            // // Successful authentication, redirect home.
            const chatId = nanoid();
            const { error } = await supabase
                .from('chats')
            .insert({ chat_id: chatId, chat_title: 'New Chat', user_id: req.user.user_id, created_by: req.user._json.email });
            if (error) {
                throw error;
            }
            res.redirect(`http://localhost:3001/chat/${chatId}`);
        } catch (error) {
            console.error('Error during Google OAuth callback:', error);
            return res.redirect(`/?error=${encodeURIComponent('Authentication failed. Please try again.')}`);
        }
    }
);
export default router;