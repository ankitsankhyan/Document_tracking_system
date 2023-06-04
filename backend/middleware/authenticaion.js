const jwt = require("jsonwebtoken");
const User = require("../Model/user");
const asyncHandler = require("express-async-handler");

const protect = async(req, res, next) => {
  let token;
  
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      //decodes token id
       console.log(token, 'is token');
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
// this means that user is searched in data
      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
}

module.exports = { protect };