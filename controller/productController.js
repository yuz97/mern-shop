import asyncHandler from "../middleware/asyncHandler.js";
import Product from "../model/productModel.js";
import { errorJson } from "../utils/errorHandler.js";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

export const getAllProduct = asyncHandler(async (req, res) => {
  // const products = await Product.find();

  // req query
  const queryObj = { ...req.query };

  // function utk abaikan jika ada req page dan limit
  const excludeField = ["page", "limit"];
  excludeField.forEach((element) => delete queryObj[element]);

  let query = Product.find(queryObj);

  //pagination
  const page = req.query.page * 1 || 1;
  const limitData = req.query.limit * 1 || 30;
  const skipData = (page - 1) * limitData;

  query = await query.skip(skipData).limit(limitData);

  if (req.query.page) {
    const numProduct = await Product.countDocuments();
    if (skipData >= numProduct) {
      res.status(400);
      throw new Error("this page doesn't exists");
    }
  }

  const data = await query;

  return res.status(200).json({
    data,
  });
});

export const createProduct = asyncHandler(async (req, res) => {
  const { name, price, description, image, category, stock } = req.body;

  const product = await Product.create({
    name,
    price,
    description,
    image,
    category,
    stock,
  });

  return res.status(201).json({
    message: "produk berhasil ditambahkan",
    data: product,
  });
});

export const showProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const product = await Product.findOne({ _id: id });

  errorJson(product, res);

  return res.status(200).json({
    message: "data berhasil ditampilkan",
    data: product,
  });
});

export const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // const product = await Product.findByIdAndUpdate(id, req.body, {
  //   runValidators: false,
  //   new: true,
  // });

  const product = await Product.findOneAndUpdate({ _id: id }, req.body, {
    runValidators: false,
    new: true,
  });

  errorJson(product, res);

  return res.status(201).json({
    message: "update product berhasil",
    data: product,
  });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await Product.findOneAndDelete({ _id: id });

  errorJson(product, res);

  return res.status(201).json({
    message: " product berhasil dihapus",
  });
});

export const fileUpload = asyncHandler(async (req, res) => {
  // const file = req.file;

  // if (!file) {
  //   res.status(400);
  //   throw new Error("tidak ada file yang di input");
  // }

  // const imgFileName = file.filename;
  // const pathImg = `/img/${imgFileName}`;

  const stream = cloudinary.uploader.upload_stream(
    {
      folder: "img",
      allowed_format: ["jpg", "jpeg", "png", "svg"],
    },
    function (err, result) {
      if (err) {
        console.log(err);
        return res.status(500).json({
          message: "gagal upload image",
          error: err,
        });
      }

      const imageUrl = cloudinary.url(result.public_id, {
        fetch_format: "auto",
        quality: "auto",
        crop: "auto",
        gravity: "auto",
        width: 400,
        height: 400,
      });

      res.status(201).json({
        message: "gambar berhasil diupload",
        // url: result.secure_url,
        url: imageUrl,
      });
    }
  );

  streamifier.createReadStream(req.file.buffer).pipe(stream);
});
