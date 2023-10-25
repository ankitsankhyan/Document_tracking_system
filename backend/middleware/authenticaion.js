const jwt = require("jsonwebtoken");
const User = require("../Model/user");

// sudo su
const protect = async(req, res, next) => {
  console.log('running');
  let token;
  
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
      console.log(req.body, 'inside middleware of auth');
   
      token = req.headers.authorization.split(" ")[1];
      console.log(token, 'after');
      if(!token){
        res.status(401).json({
          message:'token not found'
        });
        return;
      }
      //decodes token id
    try{
      const decoded = jwt.verify(token, 'docuemnt-tracking-system');
    
     
// this means that user is searched in data
      const loggedin = await User.findById(decoded.id).select("-password");
      if(!loggedin){
        res.status(401).json({
          message:'user not found'
        });
        return;
      }
       req.user = loggedin;
      next();
    }catch(error){
      res.status(401).json({
          error : 'token is invalid'
      })
    }
  }
 
  if (!token) {
    res.status(401).json({
      error:"no token is there"
    })
  }
}

module.exports = { protect };