import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import dateExpired from "../../helpers/dateExpired.js";

const config = process.env;

const RefreshTokenSchema = new mongoose.Schema({
  token: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  expiryDate: {
    type: Date,
    // expires: Number(config.jwtRefreshExpiration)/1000,
  },
});

RefreshTokenSchema.statics.createToken = async function (user_id) {
  let expiredAt = new Date(dateExpired(Number(config.jwtRefreshExpiration)));
  let _token = uuidv4();

  let _object = new this({
    token: _token,
    user: user_id,
    // expiryDate: expiredAt.getTime(),
  });

  let refreshToken = await _object.save();
  return refreshToken.token;
};

RefreshTokenSchema.statics.verifyExpiration = (token) => {
  return token.expiryDate < new Date().getTime();
};

const RefreshToken = mongoose.model("RefreshToken", RefreshTokenSchema);
RefreshToken.createIndexes()
export default RefreshToken;
