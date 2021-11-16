import mongoose from "mongoose";

const Schema = mongoose.Schema;

export const TopicSchema = new Schema({
  String,
  index: true,
});
