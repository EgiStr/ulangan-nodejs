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
      .skip(params.perPage * params.page - params.perPage)
      .limit(params.perPage);

  const countAll = (params) =>
    UserModel.countDocuments(omit(params, "page", "perPage"));

  const findById = (id) => UserModel.findById(id).select("-password");

  const findHistoryById = (id) => HistoryModel.findById(id).populate("ulangan");

  const add = (user) => {
    const newUser = new UserModel({
      username: user.username,
      password: user.password,
      email: user.email,
      role:user.role
    });

    return newUser.save();
  };

  const addGuru = (user) => {
    const newUser = new UserModel({
      username: user.userName,
      password: user.password,
      email: user.email,
      role: user.role,
    });

    return newUser.save();
  };

  return {
    findByProperty,
    countAll,
    findById,
    add,
    addGuru,
    findHistoryById,
  };
}
