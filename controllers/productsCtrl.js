import Product from '../model/Product.js';
import asyncHandler from 'express-async-handler';
import Category from '../model/Category.js';
import Type from '../model/Type.js';

export const createProductCtrl = asyncHandler(async (req, res) => {
  const { name, description, category, reviews, price, totalQty, type } = req.body;
  const convertedImgs = req.files.map((file) => file?.path);

  const productExists = await Product.findOne({ name });
  if (productExists) {
    throw new Error('Yparxei auto,xupna!!');
  }

  //find the category
  const categoryFound = await Category.findOne({
    name: category,
  });
  if (!categoryFound) {
    throw new Error('Mastora den mas ta les kala..');
  }

  // find the type
  const typeFound = await Type.findOne({
    name: type?.toLowerCase(),
  });
  if (!typeFound) {
    throw new Error('Mastora den mas ta les kala..,kane kati kainourgio or des xana tin ton typo..');
  }

  const product = await Product.create({
    name,
    description,
    category,
    user: req.userAuthId,

    reviews,
    price,
    totalQty,
    type,
    images: convertedImgs,
  });
  categoryFound.products.push(product._id);
  //resave
  await categoryFound.save();
  //push product into category
  typeFound.products.push(product._id);
  //resave
  await typeFound.save();
  res.status(201).json({
    status: 'success',
    message: 'Product created successfully',
    product,
  });
});

export const getProductsCtrl = asyncHandler(async (req, res) => {
  let productQuery = Product.find();
  // console.log(productQuery);
  // const products = await Product.find();

  if (req.query.name) {
    productQuery = productQuery.find({
      name: { $regex: req.query.name, $options: 'i' },
    });
  }

  if (req.query.type) {
    productQuery = productQuery.find({
      type: { $regex: req.query.type, $options: 'i' },
    });
  }
  if (req.query.category) {
    productQuery = productQuery.find({
      category: { $regex: req.query.category, $options: 'i' },
    });
  }
  if (req.query.price) {
    const priceRange = req.query.price.split('-');
    productQuery = productQuery.find({
      price: { $gte: priceRange[0], $lte: priceRange[1] },
    });
  }

  //page
  const page = parseInt(req.query.page) ? parseInt(req.query.page) : 1;
  //limit
  const limit = parseInt(req.query.limit) ? parseInt(req.query.limit) : 100;

  //STARTINDEX
  const startIndex = (page - 1) * limit;
  //endindex
  const endIndex = page * limit;
  //total
  const total = await Product.countDocuments();
  productQuery = productQuery.skip(startIndex).limit(limit);

  //pagination results
  const pagination = {};
  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }
  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  const products = await productQuery.populate('reviews');
  res.json({
    status: 'success',
    total,
    results: products.length,
    pagination,
    message: 'Bires mazeutikan..ante geia mas',
    products,
  });
});

export const getProductSingle = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate({
    path: 'reviews',
    populate: {
      path: 'user',
      select: 'fullname',
    },
  });
  if (!product) {
    throw new Error('byra den found');
  }
  res.json({
    status: 'success',
    message: 'Byra mazeutike ola kala..',
    product,
  });
});

export const updateProductCtrl = asyncHandler(async (req, res) => {
  const { name, description, category, user, images, reviews, price, totalQty, type } = req.body;
  //update
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    {
      name,
      description,
      category,
      user,
      images,
      reviews,
      price,
      totalQty,
      type,
    },
    {
      new: true,
    }
  );
  res.json({
    status: 'success',
    message: 'Byra update na pioume...',
    product,
  });
});

export const deleteProductCtrl = asyncHandler(async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({
    status: 'success',
    message: 'Paei auti i byra na tan kai alli',
  });
});
