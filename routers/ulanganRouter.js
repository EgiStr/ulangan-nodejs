import express from "express";
import UlanganControllers from "../controllers/ulanganControllers.js";
import authMiddleware from "../middlewares/auth/authMiddleware.js";

export default function ulanganRouter() {
  const router = express.Router();
  const controllers = new UlanganControllers();

  router.get("/", controllers.fetchUlanganByProperty);
  router.get("/creator", [authMiddleware], controllers.draftUserUlangan);
  router.get("/creator/:id", [authMiddleware], controllers.detailUlangan);
  // realTime Pusher
  router.get("/:id", controllers.ulangan);
  router.get("/multi/:id", controllers.ulanganMulti);
  router.post("/multi/:id/startEvent", controllers.ulanganStartEvent);
  

  router.post("/", [authMiddleware], controllers.addUlangan);
  router.post("/placeanswer", [authMiddleware], controllers.placeAnswers);

  router.patch("/:id", [authMiddleware], controllers.updateUlangan);
  router.put("/:id", [authMiddleware], controllers.updateUlangan);

  router.delete("/:id", [authMiddleware], controllers.deleteUlangan);

  return router;
}
