import express from 'express';
import {
  createTypeCtrl,
  getAllTypesCtrl,
  getSingleTypeCtrl,
  deleteTypeCtrl,
  updateTypeCtrl,
} from '../controllers/typeCtrl.js';
import isAdmin from '../middlewares/isAdmin.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';

const typesRouter = express.Router();

typesRouter.post('/', isLoggedIn, isAdmin, createTypeCtrl);
typesRouter.get('/', getAllTypesCtrl);
typesRouter.get('/:id', getSingleTypeCtrl);
typesRouter.delete('/:id', isLoggedIn, isAdmin, deleteTypeCtrl);
typesRouter.put('/:id', isLoggedIn, isAdmin, updateTypeCtrl);

export default typesRouter;
