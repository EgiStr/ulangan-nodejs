import mongoose from "mongoose";
import { QuestionSchema } from "./question.js";

const model = mongoose.model;
const Schema = mongoose.Schema;

const UlanganSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      index: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    topic: [{ type: String, index: true }],
    question: [QuestionSchema],
  },
  { timestamps: true }
);
const UlanganModel = model("Ulangan", UlanganSchema);
UlanganModel.createIndexes();
export default UlanganModel;
