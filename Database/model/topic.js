import mongoose from "mongoose";

const model = mongoose.model
const Schema = mongoose.Schema

export const TopicSchema = new Schema({
  content: String,
});
