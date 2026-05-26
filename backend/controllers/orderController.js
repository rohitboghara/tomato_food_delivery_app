import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js"
import Stripe from "stripe";
import { isObjectId, validateOrderInput, validateStatus } from "../utils/validation.js";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// config variables
const currency = "inr";
const deliveryCharge = 50;

const getFrontendUrl = (req) => {
    const protocol = req.get("x-forwarded-proto") || req.protocol;
    return process.env.FRONTEND_URL || req.get("origin") || `${protocol}://${req.hostname}:3000`;
}

// Placing User Order for Frontend
const placeOrder = async (req, res) => {

    try {
        const validationError = validateOrderInput(req.body);
        if (validationError) {
            return res.status(400).json({ success: false, message: validationError });
        }

        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address,
        })
        await newOrder.save();
        await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });
        const frontendUrl = getFrontendUrl(req);

        const line_items = req.body.items.map((item) => ({
            price_data: {
              currency: "inr",
              product_data: {
                name: item.name
              },
              unit_amount: item.price * 100
            },
            quantity: item.quantity
          }))

        line_items.push({
            price_data:{
                currency,
                product_data:{
                    name:"Delivery Charge"
                },
                unit_amount: deliveryCharge * 100
            },
            quantity:1
        })
        
          const session = await stripe.checkout.sessions.create({
            success_url: `${frontendUrl}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${frontendUrl}/verify?success=false&orderId=${newOrder._id}`,
            line_items: line_items,
            mode: 'payment',
          });
      
          res.json({success:true,session_url:session.url});

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

// Listing Order for Admin panel
const listOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.json({ success: true, data: orders })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

// User Orders for Frontend
const userOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({ userId: req.body.userId });
        res.json({ success: true, data: orders })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

const updateStatus = async (req, res) => {
    try {
        if (!isObjectId(req.body.orderId) || !validateStatus(req.body.status)) {
            return res.status(400).json({ success: false, message: "Invalid order status update" });
        }
        await orderModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status });
        res.json({ success: true, message: "Status Updated" })
    } catch (error) {
        res.json({ success: false, message: "Error" })
    }

}

const verifyOrder = async (req, res) => {
    const {orderId , success} = req.body;
    try {
        if (!isObjectId(orderId)) {
            return res.status(400).json({ success: false, message: "Invalid order id" });
        }
        if (success==="true") {
            await orderModel.findByIdAndUpdate(orderId, { payment: true });
            res.json({ success: true, message: "Paid" })
        }
        else{
            await orderModel.findByIdAndDelete(orderId)
            res.json({ success: false, message: "Not Paid" })
        }
    } catch (error) {
        res.json({ success: false, message: "Not  Verified" })
    }

}

export { placeOrder, listOrders, userOrders, updateStatus ,verifyOrder }
