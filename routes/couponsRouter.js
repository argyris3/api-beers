import express from 'express';
import {
  createCouponCtrl,
  getAllCouponsCtrl,
  deleteCouponCtrl,
  updateCouponCtrl,
  getCouponCtrl,
} from '../controllers/couponsCtrl.js';
import isAdmin from '../middlewares/isAdmin.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';

const couponsRouter = express.Router();

couponsRouter.post('/', isLoggedIn, isAdmin, createCouponCtrl);
couponsRouter.get('/', getAllCouponsCtrl);
couponsRouter.delete('/delete/:id', isLoggedIn, isAdmin, deleteCouponCtrl);
couponsRouter.get('/single?', getCouponCtrl);
couponsRouter.put('/update/:id', isLoggedIn, isAdmin, updateCouponCtrl);

export default couponsRouter;
