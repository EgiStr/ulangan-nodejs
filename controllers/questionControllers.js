import QuestionServices from "../services/questionServices.js";

export default class QuestionControllers {
  constructor(services = new QuestionServices()) {
    this.services = services;
  }
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

    this.services
      .findByProperty(params)
      .then((users) => {
        response.users = users;
        return this.services.countAll(params);
      })
      .then((totalItems) => {
        response.totalItems = totalItems;
        response.totalPages = Math.ceil(totalItems / params.perPage);
        response.itemsPerPage = params.perPage;
        return res.json(response);
      })
      .catch((error) => next(error));
  };

  addQuestion = (req, res, next) => {
    const { id_ulangan, question, answers } = req.body;
    this.services
      .addNewQuestion(id_ulangan, question, answers)
      .then((result) => {
        res.status(201).json(result);
      })
      .catch((err) => next(err));
  };

  updateQuestion = (req, res, next) => {
    const user = req.user;
    const { question, answers } = req.body;
    const { id } = req.params;
    this.services
      .updateQuestion(user, id, question, answers)
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => next(err));
  };

  deleteQuestion = (req, res, next) => {
    const user = req.user;
    const { id } = req.params;
    this.services
      .deleteQuestion(user, id)
      .then((result) => {
        res.status(203);
      })
      .catch((err) => next(err));
  };
}
