import express from 'express';
import  { requestHandler } from '../controllers/verificationController.js';
const router = express.Router();

export default router.post('/', requestHandler);
