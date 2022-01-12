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
    draft: {
      type: Boolean,
      default: true,
    },
    private: {
      type: Boolean,
      default: false,
    },
    question: [QuestionSchema],
  },
  { timestamps: true }
);
UlanganSchema.index(
  { title: "text", topic: "text" },
  { weights: { title: 10, topic: 5 } }
);
UlanganSchema.statics.lookup = function (opt) {
  const path = opt.path;
  let rel = mongoose.model(this.schema.path(path).options.ref);
  let pipeline = [
    { $match: opt.query },
    { $unwind: `$${path}` },
    { $skip: opt.skip },
    { $limit: opt.limit },
    {
      $lookup: {
        from: rel.collection.name,
        as: path,
        localField: path,
        foreignField: "_id",
      },
    },
  ];

  return this.aggregate(pipeline)
    .exec()
    .then((r) =>
      r.map((m) => {
        return this({ ...m, owner: m[path] });
      })
    );
};

const UlanganModel = model("Ulangan", UlanganSchema);

UlanganModel.createIndexes();

export default UlanganModel;
