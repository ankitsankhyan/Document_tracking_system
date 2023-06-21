const jwt = require("jsonwebtoken");
const User = require("../Model/user");


const protect = async(req, res, next) => {
  let token;
  
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      console.log(req.headers.authorization, 'is req.headers.authorization');
      token = req.headers.authorization.split(" ")[1];
   
      //decodes token id
     
      const decoded = jwt.verify(token, 'docuemnt-tracking-system');
// this means that user is searched in data
   
      const loggedin = await User.findById(decoded.id).select("-password");
    
       req.user = loggedin;
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