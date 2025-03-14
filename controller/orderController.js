import asyncHandler from "../middleware/asyncHandler.js";
import Product from "../model/productModel.js";
import Order from "../model/orderModel.js";
import midtransClient from "midtrans-client";
import dotenv from "dotenv";
dotenv.config();

// midtrans snap configuration
let snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.SERVER_KEY,
  clientKey: process.env.CLIENT_KEY,
});

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
  let orderMidtrans = [];
  let total = 0;

  for (const cart of cartItem) {
    const productData = await Product.findOne({ _id: cart.product });

    if (!productData) {
      res.status(400);
      throw new Error("id product tidak ditemukan");
    }

    const { name, price, _id, stock } = productData;

    if (cart.quantity > stock) {
      res.status(400);
      throw new Error(`${name} melebihi batas stock,ubah jumlah produk`);
    }

    const singleProduct = {
      name,
      quantity: cart.quantity,
      price,
      stock,
      product: _id,
    };

    const shortName = name.substring(0, 30);
    const singleProductMidtrans = {
      name: shortName,
      quantity: cart.quantity,
      price,
      id: _id,
    };

    orderItem = [...orderItem, singleProduct];
    orderMidtrans = [...orderMidtrans, singleProductMidtrans];
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

  let params = {
    transaction_details: {
      order_id: order._id,
      gross_amount: total,
    },
    item_details: orderMidtrans,
    customer_details: {
      first_name: firstName,
      last_name: lastName,
      email: email,
      phone: phone,
    },
  };

  const token = await snap.createTransaction(params);

  return res.status(200).json({
    order,
    total,
    message: "data berhasil ditampilkan",
    token,
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

//midtrans
export const handlerNotification = asyncHandler(async (req, res) => {
  const statusResponse = await snap.transaction.notification(req.body);

  let orderId = statusResponse.order_id;
  let transactionStatus = statusResponse.transaction_status;
  let fraudStatus = statusResponse.fraud_status;

  const orderData = await Order.findById({ orderId });

  if (!orderData) {
    res.status(400);
    throw new Error("order tidak ditemukan");
  }

  const orderProduct = orderData.cartItem;
  const updateStock = async (itemProduct) => {
    const productData = await Product.findById(itemProduct.product);

    if (!productData) {
      res.status(400);
      throw new Error("Product not found");
    }

    productData.stock -= itemProduct.quantity;

    await productData.save();
  };

  const handleTransaction = async () => {
    if (transactionStatus === "capture" && fraudStatus === "accept") {
      // Process successful payment
      await Promise.all(orderProduct.map(updateStock));
      orderData.status = "success";
    } else if (transactionStatus === "settlement") {
      // Process settlement
      await Promise.all(orderProduct.map(updateStock));
      orderData.status = "success";
    } else if (["cancel", "deny", "expire"].includes(transactionStatus)) {
      // Handle failure statuses
      orderData.status = "failed";
    } else if (transactionStatus === "pending") {
      // Handle pending status
      orderData.status = "pending";
    }
  };

  await handleTransaction();
  await orderData.save();

  return res.status(200).send("Payment notification is success!");
});
