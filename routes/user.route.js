const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const userController = require('../controllers/user.controller.js');
const { authUser } = require('../middlewares/auth.middlewares');

router.post('/register', [
  body('email').isEmail().withMessage('Invalid Email'),
  body('password').isLength({ min: 6 }).withMessage('password must be 6 characters long')
], userController.registerUser);

router.post('/login', [
  body('email').isEmail().withMessage('Invalid Email'),
  body('password').isLength({ min: 6 }).withMessage('password must be 6 characters long')
], userController.loginUser);

router.get('/logout', authUser,userController.logoutUser);



module.exports = router;
