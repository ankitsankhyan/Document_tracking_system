const PasswordResetToken = require('../Model/passwordResetToken.js')
const User = require('../Model/user.js')
const bcrypt = require('bcryptjs');
module.exports.verifyToken =async (req, res, next)=>{
    const {user_id, token} = req.query;

    const isavailToken = await PasswordResetToken.findOne({user_id});
    if(!isavailToken){
        res.status(400).json({
            message:"Invalid token or token expired"
        })
        return;
    }
    const isMatch = await bcrypt.compare(token, isavailToken.token);
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