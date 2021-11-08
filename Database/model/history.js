import mongoose from "mongoose";

const model = mongoose.model;
const Schema = mongoose.Schema;

const HistorySchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    ulangan_id: {
      type: Schema.Types.ObjectId,
      ref: "Ulangan",
    },
    grade: {
      type: Number,
      maxlength: 100,
      validate: [(val) => val <= 100 && val >= 0, "Please in range 0-100"],
    },
  },
  { timestamps: true }
);

export default model("History", HistorySchema);
