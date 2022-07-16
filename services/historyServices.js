import historyDomain from "../domain/historyDomain.js";
import historyRepository from "../Database/repository/historyRepo.js";
import errorStatus from "../helpers/errorStatus.js";

export default class HistorySevices {
  constructor(repository = historyRepository()) {
    this.repository = repository;
  }

  async updateHistory(ulangan_id, user_id, grade, answer) {
    if (!ulangan_id || !user_id || !answer) {
      throw errorStatus("form invalid", 400);
    }
    const newHistory = historyDomain(ulangan_id, user_id, grade, answer);
    return await this.repository.update(newHistory);
  }

  async findByUserId(user_id) {
    if (!user_id) {
      throw errorStatus("invalid Form", 400);
    }
    return await this.repository.findByIdUser(user_id);
  }

  async findById(id) {
    if (!id) {
      throw errorStatus("form Invalid", 400);
    }
    return await this.repository.findById(id);
  }
}
