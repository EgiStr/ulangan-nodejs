import HistorySevices from "../services/historyServices.js";

export default class HistoryControllers {
  isconstructor() {
    this.services = new HistorySevices();
  }

  findHistoryByUserId = async (req, res, next) => {
    const user_id = req.user.id;
    this.services
      .findByUserId(user_id)
      .then((result) => {
        res.json(result);
      })
      .catch((err) => {
        next(err);
      });
  };

  findById = (req, res, next) => {
    const id = req.params.id;
    this.services
      .findById(id)
      .then((result) => {
        const data = result.data;
        res.json(result);
      })
      .catch((err) => next(err));
  };
}
