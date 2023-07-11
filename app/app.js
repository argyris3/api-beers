import express from 'express';
import cors from 'cors';
import dbConnect from '../config/dbConnect.js';
import dotenv from 'dotenv';
import userRoutes from '../routes/usersRoute.js';
import { globalErrHandler, notFound } from '../middlewares/globalErrHandler.js';
import productsRouter from '../routes/productsRoute.js';
import categoriesRouter from '../routes/categoriesRouter.js';
import typesRouter from '../routes/typesRouter.js';
import reviewRouter from '../routes/reviewRouter.js';
import orderRouter from '../routes/orderRouter.js';
import couponsRouter from '../routes/couponsRouter.js'
import Stripe from 'stripe';
import Order from '../model/Order.js';


dotenv.config();
dbConnect();
const app = express();
//stripe
const stripe = new Stripe(process.env.STRIPE_KEY);

const endpointSecret = 'whsec_0a6ca5ba52f074716800fa95daf7ba054459aafdf017805d49b07b4998837bf6';

app.post('/webhook', express.raw({ type: 'application/json' }),async (request, response) => {
  const sig = request.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  if(event.type==='checkout.session.completed'){
//update the order
   const session=event.data.object
   const {orderId}=session.metadata;
   const paymentStatus=session.payment_status
   const paymentMethod=session.payment_method_types[0];
   const totalAmount=session.amount_total;
   const currency=session.currency;
//find the order
const order=await Order.findByIdAndUpdate(JSON.parse(orderId),{
  totalPrice:totalAmount/100,currency,paymentMethod,paymentStatus
},{
  new:true,
});
console.log(order);
  }else{
return;
  }

  // Handle the event
  // switch (event.type) {
  //   case 'payment_intent.succeeded':
  //     const paymentIntentSucceeded = event.data.object;
  //     // Then define and call a function to handle the event payment_intent.succeeded
  //     break;
  //   // ... handle other event types
  //   default:
  //     console.log(`Unhandled event type ${event.type}`);
  // }

  // Return a 200 response to acknowledge receipt of the event
  response.send();
});
app.use(cors());

app.use(express.json());

app.use('/api/v1/users/', userRoutes);
app.use('/api/v1/products/', productsRouter);
app.use('/api/v1/categories', categoriesRouter);
app.use('/api/v1/types', typesRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/orders', orderRouter);
app.use('/api/v1/coupons', couponsRouter);






app.use(notFound);
app.use(globalErrHandler);

export default app;
