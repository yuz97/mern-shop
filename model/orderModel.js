import mongoose, { Schema } from "mongoose";

const singleProduct = Schema({
  name: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  product: {
    type: mongoose.Schema.ObjectId,
    ref: "Product",
    required: true,
  },
});

const orderSchema = new Schema({
  total: {
    type: Number,
    required: [true, "total is required"],
  },
  cartItem: [singleProduct],
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "failed", "success"],
    default: "pending",
  },
  firstName: {
    type: String,
    required: [true, "first name is required"],
  },
  lastName: {
    type: String,
    required: [true, "last name is required"],
  },
  phone: {
    type: String,
    required: [true, "phone is required"],
  },
  email: {
    type: String,
    required: [true, "email is required"],
  },
});

const Order = mongoose.model("Order", orderSchema);
export default Order;
