import mongoose from "mongoose";

const Schema = mongoose.Schema;

const AnswerSchema = new Schema({
  content: String,
  correct: {
    type: Boolean,
    default: false,
  },
});

export const  QuestionSchema = new Schema({
  question: {
    type: String,
    required: true,
  },
  answers: [AnswerSchema],
});
