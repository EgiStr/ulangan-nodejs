import mongoose from "mongoose";
import validator from "validator";

const model = mongoose.model;
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: [true, "Email has been Taked"],
      index: true,
      validate: [validator.isEmail, "Email Not correct!"],
    },
    password: {
      type: String,
      required: [true, "please Enter Password"],
      minlength: [8, "please > 8"],
    },
    role: {
      type: String,
      default: "siswa",
    },
  },
  { timestamps: true }
);
const UserModel = model("User", UserSchema);
export default UserModel;
