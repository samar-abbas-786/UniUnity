const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const User = require("../models/userSchema");

async function protect(req, res, next) {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("samar")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(403).send("Access denied");
  }
  const decoded = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET_KEY
  );

  const freshUser = await User.findOne(decoded._id);
  if (!freshUser) {
    return res.status(403).send("No User Exist with this WebToken");
  }
  // console.log(decoded);
  next();
}

module.exports = { protect };
