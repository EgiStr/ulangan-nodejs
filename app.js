import express from "express";
import http from "http";
import mongoose from "mongoose";
import errorHandlingMiddlware from "./middlewares/errorHandling.js";
import configApp from "./config/configApp.js";
import connectionDb from "./Database/connection.js";
import routesApp from "./routers/index.js";
import dotenv from "dotenv";
dotenv.config();

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
routesApp(app);

app.use(errorHandlingMiddlware);

server.listen(PORT, () => {
  console.log("Server Running.....")
});

// error costume error | 404 error
