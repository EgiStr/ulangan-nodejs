import authService from "./authServices.js";
import userDomain from "../domain/userDomain.js";
import userRepository from "../Database/repository/userRepo.js";
import RefreshToken from "../Database/model/refreshToken.js";
import errorStatus from "../helpers/errorStatus.js";

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
    return await this.authServies.createAccessAndRefreshToken(payload);
  }
  async refreshToken(token) {
    try {
      let refreshToken = await this.authServies.findRefreshToken(token);

      if (!refreshToken) {
        throw errorStatus("Refresh token is not valid !", 403);
      }

      refreshToken = await this.authServies.verifyOrDeleteRefreshToken(
        refreshToken
      );

      const payload = {
        user: {
          id: refreshToken.user._id,
          username: refreshToken.user.username,
          email: refreshToken.user.email,
        },
      };
      await this.authServies.deleteRefreshToken(refreshToken.token); // rotate refresh token
      return await this.authServies.createAccessAndRefreshToken(payload);
    } catch (err) {
      throw errorStatus(err, 500);
    }
  }
  async logout(token) {
    try {
      return await this.authServies.deleteRefreshToken(token);
    } catch (error) {
      throw errorStatus(error, 500);
    }
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
  historyUser(id, params) {
    if (!id) {
      throw (new Error("You havent Login").statusCode = 403);
    }
    return this.repository.findHistoryById(id, params).then((res) => {
      return res;
    });
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
