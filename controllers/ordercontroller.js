import Order from "../models/Order.js";
import Gig from "../models/Gig.js";
import User from "../models/User.js";
import createError from "../utils/createError.js";
import Stripe from "stripe";

let stripe;

// Initialize Stripe with proper error handling
const initializeStripe = () => {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      console.warn("STRIPE_SECRET_KEY not found in environment variables");
      return null;
    }

    stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    console.log("Stripe configured successfully");
    return stripe;
  } catch (error) {
    console.warn(
      "Stripe not properly configured. Payment features will be disabled.",
      error.message
    );
    return null;
  }
};

// Initialize Stripe
stripe = initializeStripe();

export const createOrder = async (req, res, next) => {
  try {
    const gig = await Gig.findById(req.body.gigId);
    if (!gig) return next(createError(404, "Gig not found!"));

    const newOrder = new Order({
      gigId: req.body.gigId,
      img: gig.cover,
      title: gig.title,
      price: gig.price,
      sellerId: gig.userId,
      buyerId: req.userId,
      payment_intent: "temporary",
    });

    await newOrder.save();
    res.status(200).send("Order has been created.");
  } catch (err) {
    next(err);
  }
};

export const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({
      ...(req.isSeller ? { sellerId: req.userId } : { buyerId: req.userId }),
    });
    res.status(200).send(orders);
  } catch (err) {
    next(err);
  }
};

export const confirmOrder = async (req, res, next) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        isCompleted: true,
      },
      { new: true }
    );
    res.status(200).send("Order has been confirmed.");
  } catch (err) {
    next(err);
  }
};

export const createPaymentIntent = async (req, res, next) => {
  try {
    console.log("createPaymentIntent called");
    console.log("Stripe object:", stripe ? "exists" : "null");
    console.log(
      "STRIPE_SECRET_KEY:",
      process.env.STRIPE_SECRET_KEY ? "exists" : "missing"
    );

    if (!stripe) {
      // Try to reinitialize Stripe
      stripe = initializeStripe();
      if (!stripe) {
        return next(
          createError(
            500,
            "Payment processing is not available. Please configure Stripe."
          )
        );
      }
    }

    const { gigId } = req.body;
    const gig = await Gig.findById(gigId);
    if (!gig) return next(createError(404, "Gig not found!"));

    // Get customer information for Indian export regulations
    const customer = await User.findById(req.userId);
    if (!customer) return next(createError(404, "Customer not found!"));

    console.log("Customer data for payment:", {
      id: customer._id,
      username: customer.username,
      email: customer.email,
      country: customer.country,
      phone: customer.phone,
    });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: gig.price * 100, // Convert to cents
      currency: "usd",
      description: `Payment for gig: ${gig.title}`, // Required for Indian export regulations
      receipt_email: customer.email, // Customer email for receipt
      shipping: {
        name: customer.username || customer.email,
        address: {
          line1: "Default Address", // Required for Indian export regulations
          city: "Default City",
          state: "Default State",
          postal_code: "000000",
          country: customer.country || "IN",
        },
      },
      metadata: {
        customer_name: customer.username || customer.email,
        customer_email: customer.email,
        customer_country: customer.country || "Unknown",
        customer_phone: customer.phone || "Not provided",
        gig_title: gig.title,
        gig_id: gigId,
        buyer_id: req.userId,
        seller_id: gig.userId,
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    const newOrder = new Order({
      gigId: gigId,
      img: gig.cover,
      title: gig.title,
      price: gig.price,
      sellerId: gig.userId,
      buyerId: req.userId,
      payment_intent: paymentIntent.id,
    });

    await newOrder.save();

    res.status(200).send({
      clientSecret: paymentIntent.client_secret,
      orderId: newOrder._id,
    });
  } catch (err) {
    next(err);
  }
};

export const updatePaymentStatus = async (req, res, next) => {
  try {
    const { orderId, payment_intent } = req.body;

    await Order.findByIdAndUpdate(orderId, {
      payment_intent: payment_intent,
    });

    res.status(200).send("Payment status updated.");
  } catch (err) {
    next(err);
  }
};
