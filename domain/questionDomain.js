import isObject from "../helpers/isObject.js";

export default function questionDomain(question, answers = []) {
  let correctAnswer = 0;

  if (answers.length < 2) {
    const error = new Error("answers need at least 2 !");
    error.statusCode = 400;
    throw error;
  }
  answers.forEach((item) => {
    if (isObject(item)) {
      if (item.correct) {
        correctAnswer++;
      }
    } else {
      const error = new Error("answer form not Valid");
      error.statusCode = 400;
      throw error;
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
