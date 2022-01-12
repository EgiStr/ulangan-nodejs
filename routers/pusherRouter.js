import Pusher from "pusher";
import express from "express";
import authMiddleware from "../middlewares/auth/authMiddleware.js";

export default function pusherRouter() {
  const pusher = new Pusher({
    appId: process.env.APP_ID,
    key: process.env.APP_KEY,
    secret: process.env.APP_SECRET,
    cluster: process.env.APP_CLUSTER,
  });

  const router = express.Router();

  router.post("/auth", [authMiddleware], (req, res) => {
    try {
      const socketId = req.body.socket_id;
      const channel = req.body.channel_name;
      const user = req.user;
      const presenceData = {
        user_id: user.id,
        user_info: user,
      };
      const auth = pusher.authenticate(socketId, channel, presenceData);
      res.send(auth);
    } catch (error) {
      console.log(error);
    }
  });
  return router;
}
