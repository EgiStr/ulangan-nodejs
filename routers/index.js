import userRouter from "./userRouter.js";
import authRouter from "./authRouter.js";
import ulanganRouter from "./ulanganRouter.js";
import questionRouter from "./questionRouter.js";

export default function routes(app) {
  app.use("/api/v1/", authRouter());
  app.use("/api/v1/users", userRouter());
  app.use("/api/v1/ulangan", ulanganRouter());
  app.use("/api/v1/question", questionRouter());
}
