import Product from '../model/Product.js';
import Review from '../model/Review.js';
import asyncHandler from 'express-async-handler';

export const createReviewCtrl = asyncHandler(async (req, res) => {
  const { product, message, rating } = req.body;
  const { productID } = req.params;
  const productFound = await (await Product.findById(productID)).populate('reviews');
  console.log(productFound);
  if (!productFound) {
    throw new Error('paidia psaxame bura den brikame');
  }
  //check if user already kritikare tin bura
  const hasReviewed = productFound?.reviews?.find((review) => {
    return review?.user.toString() === req.userAuthId?.toString();
  });
  if (hasReviewed) {
    throw new Error('pali re malaka pes tipota gia kamia alli');
  }

  const review = await Review.create({
    message,
    rating,
    product: productFound?._id,
    user: req.userAuthId,
  });

  productFound.reviews.push(review?._id);
  //resave
  await productFound.save();
  res.status(201).json({
    success: true,
    message: 'mas krinate...',
  });
});
