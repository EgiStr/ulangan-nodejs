import Pusher from "pusher";
import UlanganSevices from "../services/ulanganServices.js";
import HistorySevices from "../services/historyServices.js";
import shuffleArray from "../helpers/shuffleArray.js";
import errorStatus from "../helpers/errorStatus.js";

export default class UlanganControllers {
  constructor(services = new UlanganSevices()) {
    this.services = services;
    this.history = new HistorySevices();
    this.pusher = new Pusher({
      appId: process.env.APP_ID,
      key: process.env.APP_KEY,
      secret: process.env.APP_SECRET,
      cluster: process.env.APP_CLUSTER,
    });
  }

  placeAnswers = (req, res, next) => {
    const user = req.user;
    const { question_id, answers } = req.body;
    this.services
      .findQuestionByQuestionId(question_id)
      .then((result) => {
        const data = result[0];
        if(!data){
          throw errorStatus("Question not found",400)
        }
        let answer;
        data.answers.forEach((item) => {
          item.forEach((it) => {
            if (it._id.toString() === answers.asnwer) {
              answer = it.correct;
            }
          });
        });
        const grade = answer ? 100 / data.total : 0;
        this.history
          .updateHistory(data._id, user.id, grade, answers)
          .then((response) => {
            res.json(response);
          })
          .catch((err) => next(err));
      })
      .catch((err) => next(err));
  };

  timedQuestion(channel_name, question_timing = 17000, row, index) {
    setTimeout(() => {
      this.pusher.trigger(channel_name, "question-given", row);
    }, index * question_timing);
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
    console.log(params);
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
        response.HasNextPage = params.page < response.totalPages;
        response.HasPreviousPage = params.page > response.totalPages;
        return res.json(response);
      })
    .catch((error) => next(error));
  };

  findByTopic = (req, res, next) => {
    const params = {};
    const response = {};
    const topic = req.params.topic;
    // Dynamically created query params based on endpoint params
    for (const key in req.query) {
      if (Object.prototype.hasOwnProperty.call(req.query, key)) {
        params[key] = req.query[key];
      }
    }
    // predefined query params (apart from dynamically) for pagination
    params.page = params.page ? parseInt(params.page, 10) : 1;
    params.perPage = params.perPage ? parseInt(params.perPage, 10) : 10;
    this.services.findByTopic(topic, params).then((result) => {
      const totalItems = result.length;
      response.ulangan = result;
      response.totalItems = totalItems;
      response.totalPages = Math.ceil(totalItems / params.perPage);
      response.itemsPerPage = params.perPage;
      res.json(response);
    });
  };

  ulanganSolo = (req, res, next) => {
    this.services
      .findById(req.params.id)
      .then((ulangan) => {
        res.json(ulangan);
        res.send("ok");
      })
      .catch((error) => next(error));
  };

  ulangan = (req, res, next) => {
    const channelName = `quiz-solo-${req.query.channel}`;
    const question_time = req.query.time
      ? Number(req.query.time) * 1000
      : 15000;
    this.services
      .findAllQuestionById(req.params.id)
      .then((ulangan) => {
        const question = shuffleArray(ulangan[0].questions);
        question.forEach((item, i) => {
          this.timedQuestion(channelName, question_time, item, i);
        });
        res.json({ total: question.length });
        // res.send("fuck")
      })
      .catch((error) => next(error));
  };

  updateUlangan = (req, res, next) => {
    const { title, topic } = req.body;
    const user = req.user;
    const id = req.params.id;
    this.services.findById(params.id).then((result) => {
      if (result === null) {
        const error = new Error("invalid Id");
        throw error;
      }
      if (result.owner._id.toString() !== user.id) {
        const error = new Error("You havent permission to Update");
        error.statusCode = 403;
        throw error;
      }
      this.services
        .updateUlangan(id, title, topic)
        .then((response) => {
          res.status(200).json(response);
        })
        .catch((err) => next(err));
    });
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
          .deleteUlangan(params.id)
          .then((response) => {
            res.status(204).json({ message: "successfully delete" });
          })
          .catch((err) => next(err));
      })
      .catch((err) => next(new Error("invalide Id")));
  };
}
