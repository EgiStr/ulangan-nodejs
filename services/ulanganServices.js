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
  findQuestionByQuestionId(id) {
    return this.repository.findQuestionByQuestionId(id);
  }
  findById(id) {
    return this.repository.findById(id);
  }
  findByIdWithQuestion(id) {
    return this.repository.findByIdWithQuestion(id);
  }

  findAllQuestionById(id) {
    return this.repository.findAllQuestionByid(id);
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
  async addUlangan(user_id, title, topic, isPrivate) {
    if (!user_id || !title || !topic || isPrivate === undefined) {
      throw new Error("form not valid");
    }
    const ulangan = ulanganDomain(user_id, title, topic, isPrivate);
    const result = await this.repository.add(ulangan).catch((err) => {
      throw new Error(err);
    });
    return result;
  }

  async deleteUlangan(id) {
    return await this.repository.deleteUlangan(id);
  }

  async updateUlangan(id, title, topic, isPrivate, draft) {
    if (!id || !title || !topic || draft === undefined) {
      throw errorStatus("form not valid", 400);
    }
    if (!Array.isArray(topic)) {
      throw errorStatus("topic unvalid!", 400);
    }
    return await this.repository.updateById(id, {
      title,
      topic,
      isPrivate,
      draft,
    });
  }
  findDraftUlangan = async (user_id) => {
    return await this.repository.findDraftUlangan(user_id);
  };
  addNewQuestion = async (id_ulangan, question, answers) => {
    console.log(question, id_ulangan, answers);
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
