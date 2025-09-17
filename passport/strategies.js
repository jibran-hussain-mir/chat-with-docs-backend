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
        try{
            console.log('hehey', profile)
        const user = profile._json;
        const response = await supabase
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
                }).select('user_id')
                if(response.error) {
                    throw response.error;
                }
        // console.log(error)
        const privateKey = fs.readFileSync('./jwt_keys/private.key');
        const payload = {
            // Add user id from db
            sub: response.data[0].user_id,
            google_id: user.sub,
            first_name: user.given_name,
            last_name: user.family_name,
            email: user.email
        }
        const token = jwt.sign(payload, privateKey, { algorithm: 'RS256' });
        profile.jwtToken = token;
        profile.user_id = response.data[0].user_id;
        return done(null, profile);
        }catch(error){
            console.error('Error in Google Strategy:', error);
            return done(error, null);
        }
    }
));

