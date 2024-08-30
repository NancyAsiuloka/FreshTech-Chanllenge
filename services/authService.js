const jwt = require("jsonwebtoken");

class AuthService {
  constructor(user, res) {
    this.user = user;
    this.res = res;
    this.token = this.signToken();
  }

  signToken() {
    return jwt.sign({ id: this.user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
  }

  setCookieOptions() {
    const cookieOptions = {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
    };
    if (process.env.NODE_ENV === "production") {
      cookieOptions.secure = true;
    }
    return cookieOptions;
  }

  sendResponse(statusCode) {
    this.user.password = undefined;

    this.res.cookie("jwt", this.token, this.setCookieOptions());

    this.res.setHeader("Authorization", `Bearer ${this.token}`);

    this.res.status(statusCode).json({
      status: "Success",
      token: this.token,
      data: {
        user: this.user,
      },
    });
  }
}

module.exports = AuthService;
