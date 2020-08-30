import express from 'express';
import MessageController from '../controllers/MessageController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/new', auth, MessageController.newMessage);
router.get('/public', auth, MessageController.getMessages);
router.get('/thinkers', auth, MessageController.thinkersMessages);
router.get('/search/:tag', auth, MessageController.searchMessage);

export default router;