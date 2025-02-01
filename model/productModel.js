import mongoose, { Schema } from "mongoose";

const productSchema = new Schema({
  name: {
    type: String,
    required: [true, "nama harus diisi"],
    unique: [true, "nama product sudah terdaftar"],
  },
  price: {
    type: Number,
    required: [true, "harga harus diisi"],
  },
  description: {
    type: String,
    required: [true, "deskripsi harus diisi"],
  },
  image: {
    type: String,
    default: null,
  },
  category: {
    type: String,
    required: [true, "kategori harus diisi"],
    enum: ["sepatu", "celana", "kaos", "kemeja"],
  },
  stock: {
    type: Number,
    default: 0,
  },
});

const Product = mongoose.model("Product", productSchema);

export default Product;
