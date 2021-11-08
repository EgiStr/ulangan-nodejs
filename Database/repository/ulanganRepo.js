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

  const add = async (ulangan) => {
    const ulanganNew = await UlanganModel.create({
      title: ulangan.title,
      owner: ulangan.owner,
      topic: ulangan.topic,
      question: ulangan.question,
    });
    return ulanganNew;
  };

  const updateById = (id, ulanganDomain) => {
    const updatedUlangan = {
      title: ulanganDomain.title,
      topic:ulanganDomain.topic,
      question:ulanganDomain.question,
    };

    return ulanganModel.findOneAndUpdate(
      { _id: id },
      { $set: updatedUlangan },
      { new: true }
    );
  };

  return {
    findByProperty,
    countAll,
    findById,
    add,
    updateById
  };
}
