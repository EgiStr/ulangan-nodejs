import UlanganModel from "../model/ulangan.js";
import questionRepository from "./questionRepo.js";
import topicRepository from "./topicRepo.js";
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
    const question = await questionRepository().addBulk(ulangan.question);
    const topic = await topicRepository().getOrAdd(ulangan.topic);
    const ulanganNew = await UlanganModel.create({
      title: ulangan.title,
      owner: ulangan.owner,
      topic,
      question,
    });
    return ulanganNew;
  };

  const updateById = (id, ulanganDomain) => {
    const updatedUlangan = {
      title: ulanganDomain,
    };

    return UlanganModel.findOneAndUpdate(
      { _id: id },
      { $set: updatedUlangan },
      { new: true }
    );
  };

  const deleteUlangan = (id) => {
    return UlanganModel.findOneAndDelete(id);
  };

  return {
    findByProperty,
    countAll,
    findById,
    add,
    updateById,
    deleteUlangan,
  };
}
