import UlanganModel from "../model/ulangan.js";
import historyRepository from "./historyRepo.js";
import mongoose from "mongoose";
import errorStatus from "../../helpers/errorStatus.js";

const ObjectId = mongoose.mongo.ObjectId;

// move it to a proper place
function omit(obj, ...props) {
  const result = { ...obj };
  props.forEach((prop) => delete result[prop]);
  return result;
}

export default function ulanganRepository() {
  const history = historyRepository();

  const findByProperty = (params) => {

    if (params.q) {
      return UlanganModel.find(
        {
          $and: [
            {
              $or: [
                { $text: { $search: params.q } },
                { title: { $regex: params.q, $options: "i" } },
                { topic: { $regex: params.q, $options: "i" } },
              ],
            },
            { isPrivate: false },
            { draft: false },
          ],
        },

        { score: { $meta: "textScore" } }
      )
        .sort({ score: { $meta: "textScore" } })
        .select(" -__v -updateAt -question" )
        .populate("owner", "_id username ")
        .skip(params.perPage * params.page - params.perPage)
        .limit(params.perPage);
    } else {
      return UlanganModel.find(omit(params, "page", "perPage"))
        .select("-updateAt -__v -question")
        .populate("owner", "_id username")
        .skip(params.perPage * params.page - params.perPage)
        .limit(params.perPage);
    }
  };

  const countAll = (params) =>
    UlanganModel.countDocuments(omit(params, "page", "perPage"));

  const findById = (id) =>
    UlanganModel.findById(id)
      .select("-question -__v -updateAt")
      .populate("owner", "_id username");

  const findByIdWithQuestion = (id) =>
    UlanganModel.findById(id)
      .select("-__v -updateAt")
      .populate("owner", "_id username");

  const findAllQuestionByid = (id) =>
    UlanganModel.aggregate([
      { $match: { _id: new ObjectId(id) } },
      {
        $project: {
          _id: 0,
          questions: "$question",
        },
      },
    ]);
  const findByIdQuestion = (id) =>
    UlanganModel.find({ "question._id": new ObjectId(id) })
      .populate("owner", "_id username")
      .select("-__v -updateAt -question");

  const findByTopic = (name, params) =>
    UlanganModel.find({
      topic: name,
    })
      .populate("owner")
      .skip(params.perPage * params.page - params.perPage)
      .limit(params.perPage);

  const add = async (ulangan) => {
    try {
      const ulanganNew = await UlanganModel.create({
        title: ulangan.title,
        owner: ulangan.owner,
        topic: ulangan.topic,
        private: ulangan.isPrivate,
        draft: true,
      });
      return ulanganNew;
    } catch (error) {
      throw error;
    }
  };

  const findQuestionByQuestionId = async (id) => {
    try {
      const ulangan = await UlanganModel.aggregate([
        { $match: { "question._id": new ObjectId(id) } },
        {
          $project: {
            answers: "$question.answers",
            total: { $size: "$question" },
          },
        },
      ]);
      return ulangan;
    } catch (error) {
      throw errorStatus(error, 500);
    }
  };

  const updateById = async (id, ulanganDomain) => {
    try {
      const updatedUlangan = {
        title: ulanganDomain.title,
        private: ulanganDomain.isPrivate,
        draft: ulanganDomain.draft,
      };
      const topics = ulanganDomain.topic;

      const success = await UlanganModel.bulkWrite([
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
      return UlanganModel.findById(id);
    } catch (error) {}
    console.log("BULK update error");
    throw errorStatus(err, 500);
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

  const findDraftUlangan = async (user_id) => {
    let data = await UlanganModel.find({
      owner: user_id,
    })
      .select("-__v -updateAt -topic")
      .populate("owner", "username");
    return data.map((item) => ({
      ...item._doc,
      question: item.question.length,
    }));
  };

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
    findQuestionByQuestionId,
    findAllQuestionByid,
    findDraftUlangan,
    findByIdWithQuestion,
  };
}
