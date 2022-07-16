import userRouter from "./userRouter.js";
import authRouter from "./authRouter.js";
import ulanganRouter from "./ulanganRouter.js";
import questionRouter from "./questionRouter.js";
import pusherRouter from "./pusherRouter.js";
import historyRouter from "./historyRouter.js";


export default function routes(app) {
  app.use("/api/v1/pusher/",pusherRouter());
  app.use("/api/v1/", authRouter());
  app.use("/api/v1/history",historyRouter())
  app.use("/api/v1/users", userRouter());
  app.use("/api/v1/ulangan", ulanganRouter());
  app.use("/api/v1/question", questionRouter());
}
