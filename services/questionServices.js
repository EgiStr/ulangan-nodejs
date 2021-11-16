import questionDomain from "../domain/questionDomain.js";
import questionRepository from "../Database/repository/questionRepo.js";

export default class QuestionServices {
  constructor(repository = questionRepository()) {
    this.repository = repository;
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

  addNewQuestion = async (id_ulangan, question, answers) => {
    if (!id_ulangan || !question || !answers) {
      const error = new Error("form not Valid");
      error.statusCode = 400;
      throw error;
    }
    const newQuestion = questionDomain(question, answers);
    const result = await this.repository.addAndUpdateUlangan(
      id_ulangan,
      newQuestion
    );
    return result;
  };

  updateQuestion = async (user,id_question, question, answers) => {
    if (!id_question || !question || !answers) {
      const error = new Error("form not Valid");
      error.statusCode = 400;
      throw error;
    }
    
    const newQuesiton = questionDomain(question, answers);
    return await this.repository.updateById(id_question, newQuesiton);
  };
  deleteQuestion = async (user,id) => await this.repository.deleteById(id);
}
