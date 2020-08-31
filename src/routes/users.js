import express from 'express';
import UserController from '../controllers/UserController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.get('/logout', auth,  UserController.logout);
router.get('/data/:id', auth, UserController.userData);
router.put('/:id', auth, UserController.update);
router.delete('/:id', auth, UserController.delete);
router.post('/resetpassword/', UserController.resetPassword)
router.put('/newpassword/:token', UserController.changePassword)
router.get('/newfriends/:country/:id', auth, UserController.recommendedFriends);
router.get('/search/:input', auth, UserController.searchUsers);
router.get('/age/:minAge/:maxAge/:id', auth, UserController.betweenAges);
router.get('/age/desc/:minAge/:maxAge/:id', auth, UserController.betweenAgesDesc);
router.post('/friendshiprequest', auth, UserController.friendshipRequest);
router.post('/rejectrequest', auth, UserController.rejectFriendshipRequest);
router.post('/acceptrequest', auth, UserController.acceptFriendshipRequest);
router.post('/cancelfriendship', auth, UserController.cancelFriendship);


export default router;