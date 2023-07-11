const PasswordResetToken = require('../Model/passwordResetToken.js')
const User = require('../Model/user.js')
const {isValidObjectId} = require('mongoose');
const bcrypt = require('bcryptjs');
module.exports.verifyToken =async (req, res, next)=>{
    console.log("running  +++++++++++++++++++++  ");
    if(!req.body.user_id || !req.body.token){
        res.status(400).json({
            message:"token is missing"
        })
        return;
    }

    if(!isValidObjectId(req.body.user_id)){
        res.status(400).json({
            message:"Invalid user id"
        })
        return;
    }
    const {user_id, token} = req.body;
    console.log(user_id, token);
    const isavailToken = await PasswordResetToken.find({userId: user_id});
    console.log(isavailToken);
    if(isavailToken.length == 0){
        res.status(400).json({
            message:"Invalid token or token expired"
        })
        return;
    }
    
    const isMatch = await bcrypt.compare(token, isavailToken[0].token);

    console.log(isMatch)
    if(!isMatch){
        res.status(400).json({
            message:"Invalid token or token expired"
        })
        return;
    }
   const user = await User.findById(user_id);
   req.user = user;
    next();

}