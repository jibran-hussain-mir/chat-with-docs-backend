import express from 'express';
import passport from 'passport';

const router = express.Router();

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], accessType: 'offline', prompt: 'consent' }));

router.get('/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: '/' }),
    async function (req, res) {
       
        console.log(req.user)
        res.cookie('token', req.user.jwtToken, {
            httpOnly: true,
            // secure: true,
            sameSite: 'strict'
        })
        // // Successful authentication, redirect home.
        res.redirect(`http://localhost:3001/`);
    }
);
export default router;