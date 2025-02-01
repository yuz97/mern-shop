import mongoose, { Schema } from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, "name is required"],
    unique: [true, "name is exists please choose another one"],
  },
  email: {
    type: String,
    required: [true, "email is required"],
    unique: [true, "name is exists please choose another one"],
    validate: {
      validator: validator.isEmail,
      message: "use email format only",
    },
  },
  password: {
    type: String,
    required: [true, "password is required"],
    minLength: [6, "min 6 character of password"],
  },

  role: {
    type: String,
    enum: ["user", "owner"],
    default: "user",
  },
});

userSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// function
userSchema.methods.comparePassword = async function (reqBody) {
  return await bcrypt.compare(reqBody, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
