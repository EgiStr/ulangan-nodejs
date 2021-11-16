import ulanganDomain from "../domain/ulanganDomain.js";
import ulanganRepository from "../Database/repository/ulanganRepo.js";
import errorStatus from "../helpers/errorStatus.js";
import questionDomain from "../domain/questionDomain.js";

export default class UlanganSevices {
  constructor(repository = ulanganRepository()) {
    this.repository = repository;
  }
  findByIdQuestion(id) {
    return this.repository.findByIdQuestion(id);
  }
  findById(id) {
    return this.repository.findById(id);
  }
  countAll(params) {
    return this.repository.countAll(params);
  }
  findByProperty(params) {
    return this.repository.findByProperty(params);
  }
  async findByTopic(topic, params) {
    if (!Array.isArray(topic)) {
      throw errorStatus("invalid topic", 400);
    }
    const result = this.repository.findByTopic(topic, params).catch((err) => {
      throw err;
    });
    return result;
  }
  async addUlangan(user_id, title, topic, question) {
    if (!user_id || !title || !topic) {
      throw new Error("form not valid");
    }
    if (!question.length > 0) {
      throw new Error("question must required");
    }
    const ulangan = ulanganDomain(user_id, title, topic, question);
    const result = await this.repository.add(ulangan).catch((err) => {
      throw new Error(err);
    });
    return result;
  }

  async deleteUlangan(id) {
    return await this.repository.deleteUlangan(id);
  }

  async updateUlangan(id, title, topic) {
    return await this.repository.updateById(id, { title, topic });
  }

  addNewQuestion = async (id_ulangan, question, answers) => {
    if (!id_ulangan || !question || !answers) {
      const error = new Error("form not Valid");
      error.statusCode = 400;
      throw error;
    }
    const newQuestion = questionDomain(question, answers);
    const result = await this.repository.addQuestion(id_ulangan, newQuestion);
    return result;
  };

  updateQuestion = async (id_question, question, answers) => {
    if (!id_question || !question || !answers) {
      const error = new Error("form not Valid");
      error.statusCode = 400;
      throw error;
    }

    const newQuesiton = questionDomain(question, answers);
    return await this.repository.updateQuestion(id_question, newQuesiton);
  };
  deleteQuestions = async (id) => {
   return await this.repository.deleteQuestion(id);
  };
}
