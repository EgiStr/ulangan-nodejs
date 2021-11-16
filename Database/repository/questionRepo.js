import QuestionModel from "../model/question.js";
import UlanganModel from "../model/ulangan.js";
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

  const addAndUpdateUlangan = async (id_ulangan, qt) => {
    const newQuestion = await QuestionModel.create({
      question: qt.quesiton,
      answers: qt.answer,
    }).catch((err) => {
      const error = new Error(err);
      error.statusCode = 400;
      throw error;
    });

    const result = await UlanganModel.findOneAndUpdate(
      { _id: id_ulangan },
      { $push: { question: newQuesiton._id } },
      { new: true }
    ).catch((err) => {
      const error = new Error(err);
      error.statusCode = 400;
      throw error;
    });
    return result;
  };

  const addBulk = async (question) => {
    try {
      const newQuestion = await QuestionModel.insertMany(question);
      return newQuestion.map((item) => item._id);
    } catch (error) {
      const newError = new Error(error);
      newError.statusCode = 400;
      throw newError;
    }
  };
  const updateById = (id, QuestionDomain) => {
    const updatedQuestion = {
      question: QuestionDomain.question,
      answers: QuestionDomain.answers,
    };

    return QuestionModel.findOneAndUpdate(
      { _id: id },
      { $set: updatedQuestion },
      { new: true }
    );
  };
  const deleteById = (id) => {
    try {
      console.log(id, "from delete");
      return QuestionModel.findOneAndRemove({ _id: id });
    } catch (error) {
      console.log(error);
    }
  };

  return {
    findByProperty,
    countAll,
    findById,
    add,
    updateById,
    deleteById,
    addBulk,
    addAndUpdateUlangan,
  };
}
