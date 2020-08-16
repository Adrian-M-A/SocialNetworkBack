import express from 'express';
import MessageController from '../controllers/MessageController.js';

const router = express.Router();

router.post('/new', MessageController.newMessage);
router.get('/public', MessageController.getMessages);
router.get('/thinkers', MessageController.thinkersMessages);
router.get('/search/:tag', MessageController.searchMessage);

export default router;