import express from "express";
import UserControllers from "../controllers/userControllers.js";

export default function () {
  const router = express.Router();
  const controller = new UserControllers();

  router.post("/login", controller.login);
  router.post("/logout", controller.login);
  router.post("/register", controller.signin);
  return router;
}
