import ulanganDomain from "../domain/ulanganDomain.js";
import ulanganRepository from "../Database/repository/ulanganRepo.js";

export default class UlanganSevices {
  constructor(repository = ulanganRepository()) {
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

  async updateUlangan(id, title) {
    return await this.repository.updateById(id, title);
  }
}
