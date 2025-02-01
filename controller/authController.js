import User from "../model/userModel.js";
import jwt from "jsonwebtoken";
import asyncHandler from "../middleware/asyncHandler.js";

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "3d",
  });
};

const createSendResToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const isDev = process.env.NODE_ENV === "development" ? false : true;
  const cookieOption = {
    expires: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    security: isDev,
  };

  res.cookie("jwt", token, cookieOption);

  user.password = undefined;

  res.status(statusCode).json({
    user,
  });
};

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const role = (await User.countDocuments()) === 0 ? "owner" : "user";

  const createUser = await User.create({
    name,
    email,
    password,
    role,
  });

  createSendResToken(createUser, 201, res);
});

export const loginUser = asyncHandler(async (req, res) => {
  console.log(req.body.email);

  //buat validasi
  if (!req.body.email || !req.body.password) {
    res.status(400);
    throw new Error("email or password is required");
  }

  // cek email sudah ada di DB atau belum terdaftar
  const userData = await User.findOne({
    email: req.body.email,
  });

  // cek password user yg terenkripsi
  if (userData && (await userData.comparePassword(req.body.password))) {
    createSendResToken(userData, 200, res);
  } else {
    res.status(400);
    throw new Error("user belum terdaftar,silahkan registrasi!");
  }
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");

  if (user) {
    // createSendResToken(user, 200, res);
    res.status(200).json({ user });
  } else {
    res.status(404);
    throw new Error("user is not found");
  }
});

export const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  // res.status(200).json({
  //   message: "logout berhasil!",
  // });

  createSendResToken("", 200, res.json({ message: "berhasil logout!" }));
});
