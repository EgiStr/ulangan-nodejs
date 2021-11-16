import questionDomain from "./questionDomain.js";
import isObject from "../utils/isObject.js";

export default function ulanganDomain(owner, title, topic, questions = []) {
  const question = questions.map((item) => {
    if (!isObject(item)) {
      const error = new Error("question form not Valid");
      throw error;
    } else {
      return questionDomain(item.question, item.answers);
    }
  });

  return {
    owner,
    title,
    topic,
    question,
  };
}
