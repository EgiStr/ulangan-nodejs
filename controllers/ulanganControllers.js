import UlanganSevices from "../services/ulanganServices.js";

export default class UlanganControllers {
  constructor(services = new UlanganSevices()) {
    this.services = services;
  }

  fetchUlanganByProperty = (req, res, next) => {
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
      .then((ulangan) => {
        response.ulangan = ulangan;
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

  findById = (req, res, next) => {
    this.services
      .findById(req.params.id)
      .then((ulangan) => res.json(ulangan))
      .catch((error) => next(error));
  };

  updateUlangan = (req, res, next) => {
    const { title } = req.body;
    const user = req.user;
    const id = req.params.id;
    this.services
      .updateUlangan(id, title)
      .then((response) => {
        res.status(200).json(response);
      })
      .catch((err) => next(err));
  };

  addUlangan = (req, res, next) => {
    const { title, question, topic } = req.body;
    const user = req.user;
    if (!Array.isArray(question)) {
      const error = new Error("question form not valid");
      error.statusCode = 400;
      throw error;
    }
    this.services
      .addUlangan(user.id, title, topic, question)
      .then((response) => {
        res.status(201).json(response);
      })
      .catch((err) => next(err));
  };

  deleteUlangan = (req, res, next) => {
    const user = req.user;
    const params = req.params;
    this.services
      .findById(params.id)
      .then((result) => {
        if (result === null) {
          const error = new Error("invalid Id");
          throw error;
        }
        if (result.owner._id.toString() !== user.id) {
          const error = new Error("You havent permission to delete");
          error.statusCode = 403;
          throw error;
        }

        this.services
          .deleteUlangan(params.id)
          .then((response) => {
            res.status(204).json({ message: "successfully delete" });
          })
          .catch((err) => next(err));
      })
      .catch((err) => next(new Error("invalide Id")));
  };
}
