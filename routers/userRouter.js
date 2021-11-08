import express from "express";
import UserControllers from "../controllers/userControllers.js";

export default function () {
  const router = express.Router();

  const controller = new UserControllers();

  router.route("/:id").get(controller.fetchUserById);
  router.route("/").get(controller.fetchUsersByProperty);
  // POST enpdpoints
  router.route("/").post(controller.signin);
  return router;
}
