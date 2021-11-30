import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import RefreshToken from "../Database/model/refreshToken.js";
import dateExpired from "../helpers/dateExpired.js";

const config = process.env;

export default function authService() {
  const encryptPassword = (password) => {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  };

  const compare = (password, hashedPassword) =>
    bcrypt.compareSync(password, hashedPassword);

  const verify = (token) =>
    jwt.verify(token, config.jwtSecret);

  const generateToken = (payload) =>
    jwt.sign(payload, config.jwtSecret, {
      expiresIn: "2h",
    });
  const generateRefresh = async (user) => await RefreshToken.createToken(user);

  const findRefreshToken = async (token) =>
    await RefreshToken.findOne({ token }).populate("user", "-password -_v");

  const verifyOrDeleteRefreshToken = async (refreshToken) => {
    if (RefreshToken.verifyExpiration(refreshToken)) {
      RefreshToken.findByIdAndRemove(refreshToken._id, {
        useFindAndModify: false,
      }).exec();
      throw errorStatus(
        "Refresh token was expired. Please make a new signin request",
        403
      );
    } else {
      return refreshToken;
    }
  };

  const createAccessAndRefreshToken = async (payload) => {
    return {
      access: generateToken(payload),
      refresh: await generateRefresh(payload.user.id),
    };
  };

  const deleteRefreshToken = async (token) =>
    await RefreshToken.findOneAndDelete({ token });


  return {
    encryptPassword,
    compare,
    verify,
    generateToken,
    generateRefresh,
    findRefreshToken,
    verifyOrDeleteRefreshToken,
    createAccessAndRefreshToken,
    deleteRefreshToken,
  };
}
