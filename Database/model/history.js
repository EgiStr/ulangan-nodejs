import mongoose from "mongoose";

const model = mongoose.model;
const Schema = mongoose.Schema;


const HistorySchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    ulangan: {
      type: Schema.Types.ObjectId,
      ref: "Ulangan",
    },
    grade: {
      type: Number,
      validate: [(val) => val <= 100 && val >= 0, "Please in range 0-100"],
      default:0
    },
    answers: [],
  },
  { timestamps: true }
);

export default model("History", HistorySchema);
