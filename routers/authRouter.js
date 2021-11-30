import express from "express";
import UserControllers from "../controllers/userControllers.js";
// import UserModel from "../Database/model/user.js";
// import UlanganModel from "../Database/model/ulangan.js";
// import createData from "../Database/seeder/factoryUlangan.js";

export default function () {
  const router = express.Router();
  const controller = new UserControllers();

  router.post("/login", controller.login);
  router.post("/logout", controller.logout);
  router.post("/register", controller.register);
  router.post("/refresh", controller.refreshToken);
  // router.get("/seeding", (req, res) => {
  //   const { users, ulangan } = createData(50);
  //   UserModel.insertMany(users)
  //     .then(() => {
  //       UlanganModel.insertMany(ulangan)
  //         .then(() => {
  //           res.send("seeding success");
  //         })
  //         .catch((err) => {
  //           res.send(err);
  //         });
  //     })
  //     .catch((err) => {
  //       res.send(err);
  //     });
  // });
  return router;
}
