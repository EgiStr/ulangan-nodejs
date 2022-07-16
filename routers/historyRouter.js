import express from "express";
import HistoryControllers from "../controllers/historyControllers.js";
import authMiddleware from "../middlewares/auth/authMiddleware.js";



export default function(){
    const router = express.Router()
    const controllers = new HistoryControllers()
    
    router.get("/",[authMiddleware],controllers.findHistoryByUserId)
    router.get("/:id",[authMiddleware],controllers.findById)
    return router
}