const config = process.env;

export default function connectionDb(mongoose, options) {
  function connectToMongo() {
    mongoose
      .connect(config.MONGO_URI, options)
      .then(
        () => {},
        (err) => console.info("MONGO ERROR ", err)
      )
      .catch((err) => console.log("ERROR ", err));
  }
  mongoose.connection.on("connected", () => {
    console.info("Connected to MongoDB!");
  });

  mongoose.connection.on("reconnected", () => {
    console.info("MongoDB reconnected!");
  });

  mongoose.connection.on("error", (error) => {
    console.error(`Error in MongoDb connection: ${error}`);
    mongoose.disconnect();
  });

  mongoose.connection.on("disconnected", () => {
    console.error(
      `MongoDB disconnected! Reconnecting in ${
        100000 / 1000
      }s...`
    );
    setTimeout(() => connectToMongo(), 100000);
  });
  return { connectToMongo };
}
