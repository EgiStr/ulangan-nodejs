import TopicModel from "../model/topic.js";
// move it to a proper place

function omit(obj, ...props) {
  const result = { ...obj };
  props.forEach((prop) => delete result[prop]);
  return result;
}

export default function TopicRepository() {
  const findByProperty = (params) =>
    TopicModel.find(omit(params, "page", "perPage"))
      .skip(params.perPage * params.page - params.perPage)
      .limit(params.perPage);
  const countAll = (params) =>
    TopicModel.countDocuments(omit(params, "page", "perPage"));

  const findById = (id) => TopicModel.findById(id);

  const getOrAdd = async (content) => {
    try {
      const data = { content };

      const topic = await TopicModel.findOneAndUpdate(
        data, // find a document with that filter
        data, // document to insert when nothing was found
        { upsert: true, new: true, runValidators: true }
      ); // options
      return topic;
    } catch (error) {
      const newerror = new Error(error);
      newerror.statusCode = 400;
      throw newerror;
    }
  };

  const updateById = (id, ulanganDomain) => {
    const updatedUlangan = {
      title: ulanganDomain.title,
      topic: ulanganDomain.topic,
      question: ulanganDomain.question,
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
    getOrAdd,
    updateById,
  };
}
