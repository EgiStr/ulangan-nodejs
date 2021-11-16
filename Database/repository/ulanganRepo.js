import UlanganModel from "../model/ulangan.js";
import mongoose from "mongoose";
const ObjectId = mongoose.mongo.ObjectId;

// move it to a proper place
function omit(obj, ...props) {
  const result = { ...obj };
  props.forEach((prop) => delete result[prop]);
  return result;
}

export default function ulanganRepository() {
  const findByProperty = (params) =>
    UlanganModel.find(omit(params, "page", "perPage"))
      .skip(params.perPage * params.page - params.perPage)
      .limit(params.perPage);

  const countAll = (params) =>
    UlanganModel.countDocuments(omit(params, "page", "perPage"));

  const findById = (id) => UlanganModel.findById(id);

  const findByIdQuestion = (id) =>
    UlanganModel.find({ "question._id": new ObjectId(id) });

  const findByTopic = (name, params) =>
    UlanganModel.find({
      topic: name,
    })
      .skip(params.perPage * params.page - params.perPage)
      .limit(params.perPage);

  const add = async (ulangan) => {
    try {
      const ulanganNew = await UlanganModel.create({
        title: ulangan.title,
        owner: ulangan.owner,
        topic: ulangan.topic,
        question: ulangan.question,
      });
      return ulanganNew;
    } catch (error) {
      throw error;
    }
  };

  const updateById = (id, ulanganDomain) => {
    const updatedUlangan = {
      title: ulanganDomain,
    };
    const topics = ulangan.topic;

    return UlanganModel.bulkWrite([
      {
        updateOne: {
          filter: { _id: id },
          update: { $set: updatedUlangan },
          new: true,
        },
      },
      {
        updateOne: {
          filter: { _id: id },
          update: { $addToSet: { topic: { $each: topics } } },
          new: true,
        },
      },
    ]);
  };

  const deleteUlangan = (id) => {
    return UlanganModel.findOneAndDelete(id);
  };

  const addQuestion = async (id_ulangan, qt) => {
    const result = await UlanganModel.findOneAndUpdate(
      { _id: id_ulangan },
      { $push: { question: qt } },
      { new: true }
    ).catch((err) => {
      const error = new Error(err);
      error.statusCode = 400;
      throw error;
    });
    return result;
  };
  const updateQuestion = (id, qt) =>
    UlanganModel.findOneAndUpdate(
      { "question._id": new ObjectId(id) },
      { "question.$.question": qt.question, "question.$.answers": qt.answers },
      { new: true }
    );

  const deleteQuestion = (id) =>
    UlanganModel.findOneAndUpdate(
      { "question._id": new ObjectId(id) },
      {
        $pull: {
          question: { _id: new ObjectId(id) },
        },
      },
      { new: true }
    );

  return {
    findByProperty,
    findByIdQuestion,
    countAll,
    findById,
    add,
    updateById,
    deleteUlangan,
    findByTopic,
    addQuestion,
    updateQuestion,
    deleteQuestion,
  };
}
