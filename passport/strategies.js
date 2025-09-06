import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import jwt from 'jsonwebtoken';
import supabase from '../db/connection.js';
import fs from 'fs';



passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_AUTH_CALLBACK_URL
},
    async function (accessToken, refreshToken, profile, done) {
        console.log('hehey', profile)
        const user = profile._json;
        const { error } = await supabase
            .from('users')
            .upsert({
                google_user_id: user.sub,
                first_name: user.given_name,
                last_name: user.family_name,
                email: user.email,
                profile_picture_url: user.picture
            },
                {
                    onConflict: "email"
                })
        // console.log(error)
        const privateKey = fs.readFileSync('./jwt_keys/private.key');
        const payload = {
            // Add user id from db
            google_id: user.sub,
            first_name: user.given_name,
            last_name: user.family_name,
            email: user.email
        }
        const token = jwt.sign(payload, privateKey, { algorithm: 'RS256' });
        profile.jwtToken = token;
        return done(null, profile);
    }
));

