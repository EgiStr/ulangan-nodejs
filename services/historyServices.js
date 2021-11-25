import historyDomain from "../domain/historyDomain.js";
import historyRepository from "../Database/repository/historyRepo.js";
import errorStatus from "../helpers/errorStatus.js";

export default class UlanganSevices {
  constructor(repository = historyRepository()) {
    this.repository = repository;
  }
  async updateHistory(ulangan_id, user_id, grade, answer) {
    if (!ulangan_id || !user_id || !grade || !answer) {
      throw errorStatus("form invalid", 400);
    }
    const newHistory = historyDomain(ulangan_id, user_id, grade, answer);
    return await this.repository.getOrUpdate(newHistory);
  }
}
