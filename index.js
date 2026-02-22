import express from "express";
import 'dotenv/config';
import passport from 'passport';
import cors from 'cors';
import chatRouter from './api/v1/routes/chat.js';
import storageRouter from './api/v1/routes/storage.js';
import authRouter from './api/v1/routes/auth.js';
import userRouter from './api/v1/routes/user.js';
import './passport/strategies.js';

const app = express();
app.use(express.json());
app.use(passport.initialize());

const apiVersion = process.env.API_VERSION || 'v1';

app.use(cors());
// Add middleware to authenticate requests
app.use(`/api/${apiVersion}/auth`, authRouter);
app.use(`/api/${apiVersion}/chat`, chatRouter);
app.use(`/api/${apiVersion}/storage`, storageRouter);
app.use(`/api/${apiVersion}/users`, userRouter); // change from plural to singular



const http_port = process.env.HTTP_PORT
console.log('qwerty', http_port)

app.listen(http_port, () => {
  console.log(`Server is running on port ${http_port}`);
});
