const express = require('express');
const { getUsers,addUser } = require('../controllers/userController');
const userRouter = express.Router();

userRouter.get('/',getUsers);
userRouter.post('/',addUser);

module.exports = userRouter;