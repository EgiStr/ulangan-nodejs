import mongoose from "mongoose";

const model = mongoose.model
const Schema = mongoose.Schema

const AnswerSchema = new Schema({
  content: String,
  correct: {
    type: Boolean,
    default: false,
  },
});

const QuestionSchema = new Schema({
  question: {
    type: String,
    required: true,
  },
  answers: [AnswerSchema],
});

export default model("Question", QuestionSchema);
