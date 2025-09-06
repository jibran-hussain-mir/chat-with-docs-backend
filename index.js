import express from "express";
import 'dotenv/config';
import passport from 'passport';
import chatRouter from './api/v1/routes/chat.js';
import storageRouter from './api/v1/routes/storage.js';
import authRouter from './api/v1/routes/auth.js';
import './passport/strategies.js';

const app = express();
app.use(passport.initialize());

const apiVersion = process.env.API_VERSION || 'v1';

app.use(`/api/${apiVersion}/auth`, authRouter);
app.use(`/api/${apiVersion}/chat`, chatRouter);
app.use(`/api/${apiVersion}/storage`, storageRouter);


const http_port = process.env.HTTP_PORT
console.log('qwerty', http_port)

app.listen(http_port, () => {
  console.log(`Server is running on port ${http_port}`);
});
