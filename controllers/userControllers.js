import authService from "../services/authServices.js";
import userServices from "../services/userServices.js";

class UserControllers {
  repository = new userServices();
  authServies = authService();

  fetchUsersByProperty = (req, res, next) => {
    const params = {};
    const response = {};

    // Dynamically created query params based on endpoint params
    for (const key in req.query) {
      if (Object.prototype.hasOwnProperty.call(req.query, key)) {
        params[key] = req.query[key];
      }
    }
    // predefined query params (apart from dynamically) for pagination
    params.page = params.page ? parseInt(params.page, 10) : 1;
    params.perPage = params.perPage ? parseInt(params.perPage, 10) : 10;

    this.repository
      .findByProperty(params)
      .then((users) => {
        response.users = users;
        return this.repository.countAll(params);
      })
      .then((totalItems) => {
        response.totalItems = totalItems;
        response.totalPages = Math.ceil(totalItems / params.perPage);
        response.itemsPerPage = params.perPage;
        return res.json(response);
      })
      .catch((error) => next(error));
  };

  fetchUserById = (req, res, next) => {
    findById(req.params.id, dbRepository)
      .then((user) => res.json(user))
      .catch((error) => next(error));
  };

  signin = (req, res, next) => {
    const { username, password, email, role, createdAt } = req.body;
    this.repository
      .signin(username, password, email, role)
      .then((user) => res.json(user))
      .catch((error) => next(error));
  };
}
export default UserControllers;
