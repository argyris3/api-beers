import asyncHandler from 'express-async-handler';
import Type from '../model/Type.js';

export const createTypeCtrl = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const typeFound = await Type.findOne({ name });
  if (typeFound) {
    throw new Error('Bira upaxei leme..');
  }
  //create
  const type = await Type.create({
    name: name.toLowerCase(),
    user: req.userAuthId,
  });
  res.json({
    status: 'success',
    message: 'Type egine successfully',
    type,
  });
});

export const getAllTypesCtrl = asyncHandler(async (req, res) => {
  const types = await Type.find();
  res.json({
    status: 'success',
    message: 'Bires gemisan',
    types,
  });
});

export const getSingleTypeCtrl = asyncHandler(async (req, res) => {
  const type = await Type.findById(req.params.id);
  res.json({
    status: 'success',
    message: 'Type fetched successfully',
    type,
  });
});

export const updateTypeCtrl = asyncHandler(async (req, res) => {
  const { name } = req.body;
  //update
  const type = await Type.findByIdAndUpdate(
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
    type,
  });
});

export const deleteTypeCtrl = asyncHandler(async (req, res) => {
  await Type.findByIdAndDelete(req.params.id);
  res.json({
    status: 'success',
    message: 'Paei auti i katigoria na tan kai alli',
  });
});