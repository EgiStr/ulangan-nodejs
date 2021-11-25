import Pusher from "pusher";
import express from "express";

export default function pusherRouter() {
  const pusher = new Pusher({
    appId: process.env.APP_ID,
    key: process.env.APP_KEY,
    secret: process.env.APP_SECRET,
    cluster: process.env.APP_CLUSTER,
  });

  const router = express.Router();
  const channel_name = "quiz-channel";
  const question_timing = 13000; // 10s to show + 2s latency
  
  const timedQuestion = (row, index) => {
    setTimeout(() => {
      pusher.trigger(channel_name, "question-given", row);
    }, index * question_timing);
  };

  router.post("/auth", (req, res) => {
    const socketId = req.body.socket_id;
    const channel = req.body.channel_name;
    const auth = pusher.authenticate(socketId, channel);
    res.send(auth);
  });
  return router;
}
