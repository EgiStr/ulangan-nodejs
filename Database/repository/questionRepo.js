import QuestionModel from "../model/question.js";

// move it to a proper place
function omit(obj, ...props) {
  const result = { ...obj };
  props.forEach((prop) => delete result[prop]);
  return result;
}

export default function questionRepository() {
  const findByProperty = (params) =>
    QuestionModel.find(omit(params, "page", "perPage"))
      .skip(params.perPage * params.page - params.perPage)
      .limit(params.perPage);

  const countAll = (params) =>
    QuestionModel.countDocuments(omit(params, "page", "perPage"));

  const findById = (id) => QuestionModel.findById(id);

  const add = (qt) => {
    const newQuestion = new QuestionModel({
      question: qt.question,
      answers: qt.answer,
    });
    return newQuestion.save();
  };

  return {
    findByProperty,
    countAll,
    findById,
    add,
  };
}
