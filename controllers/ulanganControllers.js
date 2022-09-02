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
        if (!data) {
          throw errorStatus("Question not found", 400);
        }
        let answer;
        data.answers.forEach((item) => {
          item.forEach((it) => {
            if (it._id.toString() === answers) {
              answer = it.correct;
            }
          });
        });
        const grade = answer ? 100 / data.total : 0;
        this.history
          .updateHistory(data._id, user.id, grade, {
            answer: answers,
            question: question_id,
          })
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

  ulanganMulti = (req, res, next) => {
    const channelName = `presence-multiplayer-${req.query.channel}`;
    const question_time = req.query.time
      ? Number(req.query.time) * 1000
      : 15000;
    this.services
      .findAllQuestionById(req.params.id)
      .then((ulangan) => {
        const question = shuffleArray(ulangan[0].questions);
        const total = question.length;
        question.forEach((item, i) => {
          this.timedQuestion(channelName, question_time, { ...item, total }, i);
        });
        res.status(200);
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
    try {
      const { title, topic, isPrivate, draft } = req.body;
      const user = req.user;
      const id = req.params.id;

      this.services.findByIdWithQuestion(id).then((result) => {
        if (result === null) {
          const error = new Error("invalid Id");
          throw error;
        }
        if (result.owner._id.toString() !== user.id) {
          const error = new Error("You havent permission to Update");
          error.statusCode = 403;
          throw error;
        }
        if (draft !== undefined) {
          if (result.question.length <= 0 && !draft) {
            next(errorStatus("You can't Publish if there is no question", 400));
            return;
          }
        }

        this.services
          .updateUlangan(
            id,
            title || result.title,
            topic || result.topic,
            isPrivate !== undefined ? isPrivate : result.isPrivate || false,
            draft !== undefined ? draft : result.draft
          )
          .then((response) => {
            res.status(200).json(response);
          })
          .catch((err) => {
            console.log("di sini", err);
            next(err);
          });
      });
    } catch (error) {
      console.log("error");
      next(error);
    }
  };

  draftUserUlangan = (req, res, next) => {
    try {
      const user = req.user;
      this.services.findDraftUlangan(user.id).then((result) => {
        res.status(200).json(result);
      });
    } catch (error) {
      console.log("error", error);
      next(error);
    }
  };

  detailUlangan = (req, res, next) => {
    try {
      const id = req.params.id;
      this.services.findByIdWithQuestion(id).then((result) => {
        if (result === null) {
          const error = new Error("invalid Id");
          throw error;
        }
        res.status(200).json(result);
      });
    } catch (error) {
      console.log("error", error);
      next(error);
    }
  };

  addUlangan = (req, res, next) => {
    const { title, topic, isPrivate } = req.body;

    const user = req.user;
    this.services
      .addUlangan(user.id, title, topic, isPrivate)
      .then((response) => {
        res.status(201).json(response);
      })
      .catch((err) => {
        console.log(err);
        next(err);
      });
  };

  deleteUlangan = (req, res, next) => {
    const user = req.user;
    const params = req.params;

    this.services
      .findById(params.id)
      .then((result) => {
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
      .catch((err) => {
        console.log(err);
        next(new Error("invalide Id"));
      });
  };
}
