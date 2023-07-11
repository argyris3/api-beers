import User from '../model/User.js';
import bcrypt from 'bcryptjs';
import asyncHandler from 'express-async-handler';
import generateToken from '../utils/generateToken.js';
import { getTokenFromHeader } from '../utils/getTokenFromHeader.js';
import { verifyToken } from '../utils/verifyToken.js';

export const registerUserCtrl = asyncHandler(async (req, res) => {
  const { fullname, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.json({ msg: 'User Already Exists' });
    throw new Error('User Already Exists');
  }

  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    fullname,
    email,
    password: hashPassword,
  });
  res.status(201).json({
    status: 'success',
    msg: 'User registered successfully',
    data: user,
  });
});

export const loginUserCtrl = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const userFound = await User.findOne({
    email,
  });
  if (userFound && (await bcrypt.compare(password, userFound?.password))) {
    res.json({
      status: 'success',
      msg: 'User Login successfully',
      userFound: {
        fullname: userFound?.fullname,
        isAdmin: userFound?.isAdmin,
      },
      token: generateToken(userFound?._id),
    });
  } else {
    throw new Error('Invalid login');
  }
});

export const getUserProfileCtrl = asyncHandler(async (req, res) => {
  const user = await (await User.findById(req.userAuthId)).populate('orders');
  res.json({
    status: 'success',
    message: 'User profile fetched successfully',
    user,
  });
});

export const updateShippingAddress = asyncHandler(async (req, res) => {
  const { firstName, lastName, address, city, postalCode, province, phone, country } = req.body;
  const user = await User.findByIdAndUpdate(
    req.userAuthId,
    {
      shippingAddress: {
        firstName,
        lastName,
        address,
        city,
        province,
        postalCode,
        phone,
        country,
      },
      hasShippingAddress: true,
    },
    {
      new: true,
    }
  );
  res.json({
    status: 'success',
    message: 'User shipping address updated successfully',
    user,
  });
});
