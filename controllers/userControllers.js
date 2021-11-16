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
    this.repository
      .findById(req.params.id)
      .then((user) => res.json(user))
      .catch((error) => next(error));
  };

  dashboardUser = async (req, res, next) => {
    const userId = req.user;
    try {
      const user = await this.repository.findById(userId.id);
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  };

  historyUser = async (req, res, next) => {
    const userId = req.user;
    const params = {};

    // Dynamically created query params based on endpoint params
    for (const key in req.query) {
      if (Object.prototype.hasOwnProperty.call(req.query, key)) {
        params[key] = req.query[key];
      }
    }
    // predefined query params (apart from dynamically) for pagination
    params.page = params.page ? parseInt(params.page, 10) : 1;
    params.perPage = params.perPage ? parseInt(params.perPage, 10) : 10;

    try {
      const history = await this.repository.historyUser(userId.id, params);

      res.status(200).json(history);
    } catch (error) {
      next(error);
    }
  };

  updateUser = async (req, res, next) => {
    const userId = req.user.id;
    const { username } = req.body;
    try {
      const newUser = await this.repository.updateUser(userId, username);
      res.status(200).json(newUser);
    } catch (error) {
      next(error);
    }
  };

  deleteUser = async (req, res, next) => {
    const user = req.user;
    try {
      await this.repository.deleteUser(user.id);
      res.status(203);
    } catch (error) {
      next(error);
    }
  };

  signin = (req, res, next) => {
    const { username, password, password2, email, role } = req.body;
    this.repository
      .signin(username, password, password2, email, role)
      .then((user) => res.json(user))
      .catch((error) => next(error));
  };

  login = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const { access, refresh } = await this.repository.login(email, password);
      res.cookie("X-accessToken", access, {
        maxAge: new Date() * 60 * 60 * 24,
        httpOnly: true,
      });
      res
        .json({
          message: "success login",
          access,
          refresh,
        })
        .status(200);
    } catch (error) {
      next(error);
    }
  };

  logout = (req, res, next) => {
    if (req.cookies["X-accessToken"]) {
      res.cookie("X-accessToken", "", { maxAge: new Date(0) });
      res.status(201).json({ message: "success logout" });
    } else {
      next();
    }
  };
}
export default UserControllers;
