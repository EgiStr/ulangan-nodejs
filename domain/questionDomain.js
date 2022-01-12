import isObject from "../helpers/isObject.js";

export default function questionDomain(question, answers = []) {
  let correctAnswer = 0;

  if (answers.length < 2) {
    const error = new Error("answers need at least 2 !");
    error.statusCode = 400;
    throw error;
  }
  console.log(answers)
  answers.forEach((item) => {
    if (isObject(item)) {
      if (item.correct) {
        correctAnswer++;
      }
    }
  });
  if (correctAnswer !== 1) {
    const error = new Error("choice 1 must correct");
    error.statusCode = 400;
    throw error;
  }
  return {
    question,
    answers,
  };
}
