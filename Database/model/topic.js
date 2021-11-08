import mongoose from "mongoose";

const model = mongoose.model
const Schema = mongoose.Schema

const TopicSchema = new Schema({
  content: String,
});

export default model("Topic", TopicSchema);
