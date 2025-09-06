import express from 'express';
import storageService from '../services/storage.js';

const router = express().router;

router.post('/', storageService.addDocumentDetails);

export default router;