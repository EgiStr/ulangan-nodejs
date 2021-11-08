import mongoose from "mongoose";

const model = mongoose.model
const Schema = mongoose.Schema

const UlanganSchema = new Schema(
  {
    title: String,
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    topic: [
      {
        type: Schema.Types.ObjectId,
        ref: "Topic",
      },
    ],
    question: [
      {
        type: Schema.Types.ObjectId,
        ref: "Question",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Ulangan", UlanganSchema);
