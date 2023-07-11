import asyncHandler from 'express-async-handler';
import Category from '../model/Category.js';

export const createCategoryCtrl = asyncHandler(async (req, res) => {
  const { name } = req.body;
  //category exists
  const categoryFound = await Category.findOne({ name });
  if (categoryFound) {
    throw new Error('auti i katigoria uparxei bale alli!!');
  } 
  //create
  const category = await Category.create({
    name: name?.toLowerCase(),
    user: req.userAuthId,
    image: req?.file?.path,
  });
  res.json({
    status: 'success',
    message: 'Category created successfully',
    category,
  });
});

export const getAllCategoriesCtrl = asyncHandler(async (req, res) => {
  const categories = await Category.find();
  res.json({
    status: 'success',
    message: 'Category fetched successfully',
    categories,
  });
});

export const getSingleCategoryCtrl = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  res.json({
    status: 'success',
    message: 'Category fetched successfully',
    category,
  });
});

export const updateCategoryCtrl = asyncHandler(async (req, res) => {
  const { name } = req.body;
  //update
  const category = await Category.findByIdAndUpdate(
    req.params.id,
    {
      name,
    },
    {
      new: true,
    }
  );
  res.json({
    status: 'success',
    message: 'Byra update na pioume...',
    category,
  });
});

export const deleteCategoryCtrl = asyncHandler(async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  res.json({
    status: 'success',
    message: 'Paei auti i katigoria na tan kai alli',
  });
});
