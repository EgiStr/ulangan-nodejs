// // create factory for Ulangan model
import faker from "faker";
import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId;

const createUsers = (numUsers = 5) => {
  return Array(numUsers)
    .fill(null)
    .map((data, i) => ({
      _id: new ObjectId(),
      username: faker.name.findName(),
      
      email: faker.internet.email(),
      password: faker.internet.password(),
      role: "costumer",
    }));
};
const createUlangan = (numUsers = 5, users) => {
  return Array(numUsers)
    .fill(null)
    .map((data, i) => ({
        
      title: faker.lorem.sentence(),
      owner: users[i]._id,
      topic: createTopic(
        faker.datatype.number({
          min: 1,
          max: 4,
        })
      ),
      question: createQuestion(
        faker.datatype.number({
          min: 1,
          max: 10,
        })
      ),
    }));
};
const createTopic = (numUsers = 5) => {
  return Array(numUsers)
    .fill(null)
    .map((data, i) => faker.lorem.sentence());
};
const createQuestion = (numUsers = 5) => {
  return Array(numUsers)
    .fill(null)
    .map((data, i) => ({
      question: faker.lorem.sentence(),
      answer: createAnswer(
        faker.datatype.number({
          min: 1,
          max: 4,
        })
      ),
    }));
};
const createAnswer = (numUsers = 5) => {
  return Array(numUsers)
    .fill(null)
    .map((data, i) => ({
      content: faker.lorem.sentence(),
      correct: faker.datatype.boolean(),
    }));
};

const createData = (numUsers = 5) => {
    const users = createUsers(numUsers);
    const ulangan = createUlangan(numUsers, users);
    return {users,ulangan}
  
};

console.log(createAnswer(5));
export default createData;