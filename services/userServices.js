import authService from "./authServices.js";
import userDomain from "../domain/userDomain.js";
import userRepository from "../Database/repository/userRepo.js";

class UserServices {
  repository = userRepository();

  authServies = authService();

  async signin(username, password, password2, email, role) {
    // TODO: add a proper validation (consider using @hapi/joi)
    if (!username || !password || !email) {
      throw new Error("username, password and email fields cannot be empty");
    }
    if (password !== password2) {
      throw new Error("Password is invalid");
    }

    const newUser = userDomain(
      username,
      email,
      this.authServies.encryptPassword(password)
    );
    return this.repository.add(newUser);
  }

  async login(email, password) {
    if (!email || !password) {
      const error = new Error("email and password fields cannot be empty");
      error.statusCode = 401;
      throw error;
    }
    const user = await this.repository.findByPropertyLogin({ email });
    if (!user.length) {
      const error = new Error("Invalid email or password");
      error.statusCode = 401;
      throw error;
    }

    const isMatch = this.authServies.compare(password, user[0].password);
    if (!isMatch) {
      const error = new Error("Invalid email or password");
      error.statusCode = 401;
      throw error;
    }
    const payload = {
      user: {
        id: user[0].id,
        username: user[0].username,
        email: user[0].email,
      },
    };
    return {
      access: this.authServies.generateToken(payload),
      refresh: this.authServies.generateRefresh(payload),
    };
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

  async updateUser(id, username) {
    if (!username) {
      throw new Error("Form Must Valid");
    }
    const newUser = await this.repository.updateById(id, { username });
    return newUser;
  }

  deleteUser(id) {
    return this.repository.deleteById(id);
  }
}

export default UserServices;
