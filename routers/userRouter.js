import express from "express";
import UserControllers from "../controllers/userControllers.js";
import authMiddleware from "../middlewares/auth/authMiddleware.js";

export default function () {
  const router = express.Router();

  const controller = new UserControllers();

  router.route("/dashboard").get([authMiddleware],controller.dashboardUser);
  router.route("/:id").get(controller.fetchUserById);
  router.route("/").get(controller.fetchUsersByProperty);

  // POST enpdpoints
  router.route("/").post(controller.signin);

  router.route("/login").post(controller.login);
  router.route("/logout").post(controller.logout);

  // UPDATE endpointes
  router.route("/").patch([authMiddleware],controller.updateUser)
  
  // DELETE endpointes
  router.route("/").delete([authMiddleware],controller.deleteUser)
  
  return router;
}
