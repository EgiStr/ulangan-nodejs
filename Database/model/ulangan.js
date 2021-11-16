import mongoose from "mongoose";
import { QuestionSchema } from "./question.js";
import { TopicSchema } from "./topic.js";

const model = mongoose.model;
const Schema = mongoose.Schema;

const UlanganSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    topic: [TopicSchema],
    question: [QuestionSchema],
  },
  { timestamps: true }
);

export default model("Ulangan", UlanganSchema);
