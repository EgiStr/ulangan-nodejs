import UlanganModel from "../model/ulangan.js";

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

  const findUserById = (id) => HistoryModel.findById(id);

  const add = async (ulangan) => {
    const ulanganNew = await UlanganModel.create({
      title: ulangan.title,
      owner: ulangan.owner,
      topic: ulangan.topic,
      question: ulangan.question,
    });
    return ulanganNew;
  };

  return {
    findByProperty,
    countAll,
    findById,
    add,
    findUserById,
  };
}
