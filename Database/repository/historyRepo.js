import HistoryModel from "../model/history.js";

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

  return {
    findByProperty,
    countAll,
    findById,
    add,
  };
}
