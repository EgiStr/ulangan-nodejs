import express from "express";
import UlanganControllers from "../controllers/ulanganControllers.js";
import authMiddleware from "../middlewares/auth/authMiddleware.js";

export default function ulanganRouter() {
  const router = express.Router();
  const controllers = new UlanganControllers();

  router.get("/", controllers.fetchUlanganByProperty);
  router.get("/:id", controllers.findById);

  router.post("/", [authMiddleware], controllers.addUlangan);

  router.patch("/:id", [authMiddleware], controllers.updateUlangan);

  router.delete("/:id", [authMiddleware], controllers.deleteUlangan);

  return router;
}
