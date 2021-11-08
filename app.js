import express from "express";
import http from "http";
import mongoose from "mongoose";
import errorHandlingMiddlware from "./middlewares/errorHandling.js";
import configApp from "./config/configApp.js";
import connectionDb from "./Database/connection.js";
import routes from "./routers/index.js";


const PORT = process.env.PORT || 8000;
const app = express();
const server = http.createServer(app);

// config App (Middleware,dll)
configApp(app);
connectionDb(mongoose, {
  autoIndex: false,
  useNewUrlParser: true,
  keepAlive: true,
  connectTimeoutMS: 1000,
}).connectToMongo();



routes(app)
server.listen(PORT, () => {
  console.log(`Server running in http://127.0.0.1:${PORT}`);
});

// error costume error | 404 error
app.use(errorHandlingMiddlware);
