import UlanganSevices from "../services/ulanganServices.js";
export default class QuestionControllers {
  constructor(services = new UlanganSevices()) {
    this.services = services;
  }

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
    this.services.findByIdQuestion(id).then((result) => {
      if (result.length === 0) {
        const error = new Error("invalid Id");
        throw error;
      }
      if (result[0].owner.toString() !== user.id) {
        const error = new Error("You havent permission to Update");
        error.statusCode = 403;
        throw error;
      }
      this.services
        .updateQuestion(id, question, answers)
        .then((result) => {
          res.json(result);
        })
        .catch((err) => next(err));
    });
  };

  deleteQuestion = (req, res, next) => {
    const user = req.user;
    const { id } = req.params;
    this.services
      .findByIdQuestion(id)
      .then((result) => {
        if (result.length === 0) {
          const error = new Error("invalid Id");
          throw error;
        }
        if (result[0].owner._id.toString() !== user.id) {
          const error = new Error("You havent permission to delete");
          error.statusCode = 403;
          throw error;
        }

        this.services
          .deleteQuestions(id)
          .then((result) => {
            res.status(204).json({ message: "success deleted" });
          })
          .catch((err) => next(err));
      })
      .catch((err) => next(err));
  };
}
