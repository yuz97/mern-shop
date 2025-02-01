import asyncHandler from "../middleware/asyncHandler.js";
import Product from "../model/productModel.js";
import Order from "../model/orderModel.js";

export const getOrder = asyncHandler(async (req, res) => {
  const orders = await Order.find();

  return res.status(200).json({
    data: orders,
    message: "data berhasil ditampilkan",
  });
});

export const createOrder = asyncHandler(async (req, res) => {
  const { firstName, lastName, phone, email, cartItem } = req.body;

  if (!cartItem || cartItem.length < 1) {
    res.status(400);
    throw new Error("keranjang masih kosong");
  }

  let orderItem = [];
  let total = 0;

  for (const cart of cartItem) {
    const productData = await Product.findOne({ _id: cart.product });

    if (!productData) {
      res.status(400);
      throw new Error("id product tidak ditemukan");
    }

    const { name, price, _id } = productData;

    const singleProduct = {
      name,
      quantity: cart.quantity,
      price,
      product: _id,
    };

    orderItem = [...orderItem, singleProduct];
    total += cart.quantity * price;
  }

  const order = await Order.create({
    cartItem: orderItem,
    total,
    firstName,
    lastName,
    phone,
    email,
    user: req.user.id,
  });

  return res.status(200).json({
    order,
    total,
    message: "data berhasil ditampilkan",
  });
});

export const detailOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  return res.status(200).json({
    data: order,
    message: "data berhasil ditampilkan",
  });
});

export const currentUserOrder = asyncHandler(async (req, res) => {
  const order = await Order.findOne({ user: req.user.id });

  return res.status(200).json({
    data: order,
    message: "data berhasil ditampilkan",
  });
});
