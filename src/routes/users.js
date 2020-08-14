import express from 'express';
import UserController from '../controllers/UserController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.get('/logout', auth, UserController.logout);
router.get('/data/:id', UserController.userData);
router.put('/:id', UserController.update);
router.delete('/:id', UserController.delete);
router.get('/search/:input', UserController.searchUsers);
router.get('/age', UserController.betweenAges);
router.get('/age/desc', UserController.betweenAgesDesc);

export default router;

