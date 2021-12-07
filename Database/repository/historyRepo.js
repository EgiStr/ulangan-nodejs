import HistoryModel from "../model/history.js";
import mongoose from "mongoose";
const ObjectId = mongoose.mongo.ObjectId;

// move it to a proper place
function omit(obj, ...props) {
  const result = { ...obj };
  props.forEach((prop) => delete result[prop]);
  return result;
}

export default function historyRepository() {
  const findByProperty = (params) =>
    HistoryModel.find(omit(params, "page", "perPage"))
      .skip(params.perPage * params.page - params.perPage)
      .limit(params.perPage);

  const countAll = (params) =>
    HistoryModel.countDocuments(omit(params, "page", "perPage"));

  const findById = (id) => HistoryModel.findById(id);

  const add = (qt) => {
    const newHistory = new HistoryModel({
      user_id: qt.user_id,
      ulangan_id: qt.ulangan_id,
      grade: qt.grade,
    });
    return newHistory.save();
  };
  const update = (qt) => {
    const data = {
      user: new ObjectId(qt.user_id),
      ulangan: new ObjectId(qt.ulangan_id),
    };
    HistoryModel.bulkWrite([
      {
        updateOne: {
          filter: data,
          update: {
            $set: {
              ulangan_id:
                typeof qt.ulangan_id === ObjectId
                  ? qt.ulangan_id
                  : new ObjectId(qt.ulangan_id),
              user_id: new ObjectId(qt.user_id),
            },
            $inc: {
              grade: qt.grade,
            },
            $addToSet: {
              answers: qt.answer,
            },
          },
          new: true,
          upsert: true,
        },
      },
      {
        updateOne: {
          filter: data,
          update: {
            $set: {
              "answers.$[element].answer": qt.answer.answer,
            },
          },
          arrayFilters: [{ "element.question_id": qt.answer.question_id }],
          new: true,
          upsert: true,
        },
      },
    ]);
    return HistoryModel.find(data);
  };
  const getOrUpdate = async (qt) => {
    const data = {
      user: new ObjectId(qt.user_id),
      ulangan: new ObjectId(qt.ulangan_id),
    };
    const history = await HistoryModel.findOneAndUpdate(
      data, // find a document with that filter
      {
        $set: {
          ulangan_id:
            typeof qt.ulangan_id === ObjectId
              ? qt.ulangan_id
              : new ObjectId(qt.ulangan_id),
          user_id: new ObjectId(qt.user_id),
        },
        $inc: {
          grade: qt.grade,
        },
      }, // document to insert when nothing was found
      { upsert: true, new: true, runValidators: true }
    ); // options
    return history;
  };

  return {
    findByProperty,
    countAll,
    findById,
    add,
    getOrUpdate,
    update,
  };
}
