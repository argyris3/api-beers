import {
  registerUserCtrl,
  loginUserCtrl,
  getUserProfileCtrl,
  updateShippingAddress,
} from '../controllers/usersCtrl.js';
import express from 'express';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';

const userRoutes = express.Router();

userRoutes.post('/register', registerUserCtrl);
userRoutes.post('/login', loginUserCtrl);
userRoutes.get('/profile', isLoggedIn, getUserProfileCtrl);
userRoutes.put('/update/shipping', isLoggedIn, updateShippingAddress);

export default userRoutes;