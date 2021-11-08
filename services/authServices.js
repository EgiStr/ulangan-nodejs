import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const config = process.env;

export default function authService() {
  const encryptPassword = (password) => {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  };

  const compare = (password, hashedPassword) =>
    bcrypt.compareSync(password, hashedPassword);

  const verify = (token) => jwt.verify(token, config.jwtSecret);

  const generateToken = (payload) =>
    jwt.sign(payload, config.jwtSecret, {
      expiresIn: new Date() * 60 * 60 * 24,
    });
  const generateRefresh = (payload) =>
    jwt.sign(payload, config.refreshSecret, {
      expiresIn: new Date() * 60 * 60 * 24,
    });

  return {
    encryptPassword,
    compare,
    verify,
    generateToken,
    generateRefresh
  };
}
