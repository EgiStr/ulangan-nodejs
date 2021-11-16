import mongoose from "mongoose";
import connectionDb from "./Database/connection.js";
import dotenv from "dotenv";

dotenv.config();
const potatoSchema = new mongoose.Schema({
  name: String,
});
const potatoModel = mongoose.model("Potato", potatoSchema);

const data = [
  { name: "my potato 1" },
  { name: "my potato 2" },
  { name: "my potato 3" },
  { name: "my potato 4" },
  { name: "my potato 5" },
];

connectionDb(mongoose, {
  autoIndex: false,
  useNewUrlParser: true,
  keepAlive: true,
  connectTimeoutMS: 1000,
}).connectToMongo();

setTimeout(async () => {
  const potato = potatoModel.insertMany(data, function (err, doc) {
    console.log(err);
    console.log(doc);
  });
}, 1000);
