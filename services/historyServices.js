import historyRepository from "../Database/repository/historyRepo.js";
import errorStatus from "../helpers/errorStatus.js";

export default class HistorySevices {
  constructor(repository = historyRepository()) {
    this.repository = repository;
  }

  async findByUserId(user_id) {
    if (!user_id) {
      throw errorStatus("invalid Form", 400);
    }
    return await this.repository.findByUserId(user_id);
  }

  async findById(id) {
    if (!id) {
      throw errorStatus("form Invalid", 400);
    }
    return await this.repository.findById(id);
  }

  async deleteHistory(id) {
    if (!id) {
      throw errorStatus("form Invalid", 400);
    }
    return await this.repository.deleteById(id);
  }

  async createHistory(qt) {
    if (!qt) {
      throw errorStatus("form Invalid", 400);
    }
    return await this.repository.add(qt);
  }
}
