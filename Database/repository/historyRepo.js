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

  const findById = (id) => HistoryModel.findById(id).populate("planner");

  const findByIdUser = (id) =>
    HistoryModel.find({ user_id: id }).populate("planner").populate("user_id");

  const add = async (qt) => {
    const newHistory = await HistoryModel.create({
      user: qt.user,
      planner: qt.planner,
    });
    return newHistory;
  };

  const deleteById = async (id) => await HistoryModel.findByIdAndDelete(id);

  return {
    findByProperty,
    countAll,
    findById,
    add,
    deleteById,
    findByIdUser,
  };
}
