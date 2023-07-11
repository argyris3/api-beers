import express from 'express';
import upload from '../config/fileUpload.js';

import {
  createProductCtrl,
  getProductsCtrl,
  getProductSingle,
  updateProductCtrl,
  deleteProductCtrl,
} from '../controllers/productsCtrl.js';
import isAdmin from '../middlewares/isAdmin.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';

const productsRouter = express.Router();

productsRouter.post('/', isLoggedIn, isAdmin, upload.array('files'), createProductCtrl);

productsRouter.get('/', getProductsCtrl);
productsRouter.get('/:id', getProductSingle);
productsRouter.put('/:id', isLoggedIn, isAdmin, updateProductCtrl);
productsRouter.delete('/delete/:id/', isLoggedIn, isAdmin, deleteProductCtrl);

export default productsRouter;
