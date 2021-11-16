import express from "express";
import QuestionControllers from "../controllers/questionControllers.js";
import authMiddleware from "../middlewares/auth/authMiddleware.js";

export default function ulanganRouter() {
  const router = express.Router();
  const controllers = new QuestionControllers();
  router.get("/", controllers.fetchUsersByProperty);
  router.post("/", [authMiddleware], controllers.addQuestion);

  router.put("/:id", [authMiddleware], controllers.updateQuestion);

  router.delete("/:id", [authMiddleware], controllers.deleteQuestion);

  return router;
}
