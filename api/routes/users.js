const express = require('express');
const router = express.Router();

const UserController = require('../controllers/users');
const checkAuth = require('../middleware/check-auth');

//signup user
router.post('/signup', UserController.user_signup);

//login
router.post('/login', UserController.user_login);

//get user
router.get('/', UserController.users_get_all);

//ambil user berdasarkan id
router.get('/:userId', UserController.users_get_user);

//update user berdasarkan id
router.patch('/:userId', checkAuth, UserController.user_update);

//hapus user berdasarkan id
router.delete('/:userId', checkAuth, UserController.user_delete);

module.exports = router;