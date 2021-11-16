import UserModel from "../model/user.js";
import HistoryModel from "../model/history.js";

// move it to a proper place
function omit(obj, ...props) {
  const result = { ...obj };
  props.forEach((prop) => delete result[prop]);
  return result;
}

export default function userRepository() {
  const findByProperty = (params) =>
    UserModel.find(omit(params, "page", "perPage"))
      .select("-password -__v -role -createdAt -updatedAt")
      .skip(params.perPage * params.page - params.perPage)
      .limit(params.perPage);

  const findByPropertyLogin = (params) =>
    UserModel.find(omit(params, "page", "perPage"))
      .select("-__v -role -createdAt -updatedAt")
      .skip(params.perPage * params.page - params.perPage)
      .limit(params.perPage);

  const countAll = (params) =>
    UserModel.countDocuments(omit(params, "page", "perPage"));

  const findById = (id) => UserModel.findById(id).select("-password");

  const findHistoryById = (id, params) =>
    HistoryModel.find({ user: id })
      .populate("ulangan")
      .skip(params.perPage * params.page - params.perPage)
      .limit(params.perPage);

  const add = (user) => {
    const newUser = new UserModel({
      username: user.username,
      password: user.password,
      email: user.email,
      role: user.role,
    });

    return newUser.save();
  };

  const updateById = (id, userDomain) => {
    const updatedUser = {
      username: userDomain.username,
    };

    return UserModel.findOneAndUpdate(
      { _id: id },
      { $set: updatedUser },
      { new: true }
    );
  };

  const deleteById = (id) => UserModel.findByIdAndRemove(id);

  return {
    findByProperty,
    findByPropertyLogin,
    countAll,
    findById,
    add,
    updateById,
    deleteById,
    findHistoryById,
  };
}
