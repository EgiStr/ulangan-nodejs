import questionDomain from "./questionDomain.js";
import isObject from "../helpers/isObject.js";
import errorStatus from "../helpers/errorStatus.js";

export default function ulanganDomain(
  owner,
  title,
  topic,
  isPrivate,
  questions = []
) {
  if (!Array.isArray(topic)) {
    throw errorStatus("topic is Unvalid", 400);
  }
  
  const question = questions.map((item) => {
    if (!isObject(item)) {
      throw errorStatus("Question not Valid", 400);
    } else {
      return questionDomain(item.question, item.answers);
    }
  });

  return {
    owner,
    title,
    topic,
    isPrivate,
    question,
  };
}
