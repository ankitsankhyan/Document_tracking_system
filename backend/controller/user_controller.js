const User = require('../Model/user');
const bcrypt = require('bcryptjs');
const generateToken = require('../config/generateToken');
module.exports.createUser = async(req, res)=>{
    console.log('running');
     console.log(req.body);
   
    try{
        const {name,email, password,designation} = req.body;
        const user = await User.findOne({email:email});
     
        if(user){
            res.status(200).json({
                message:'User already exists'
            });
            return;
        }
        const newUser = await User.create({name:name,email:email,password:password,designation:designation});
        console.log(newUser);
  
    res.status(200).json({
        data:newUser
    })
}catch(e){
    console.log(e);
}

}


module.exports.updateCredentials = async(req,res)=>{
    try{
        const id = req.params.id;
        const {name,email} = req.body;
        const updateduser = await User.findByIdAndUpdate(id, {name,email});
    }catch(err){
        console.log(err);
    }
   
    res.status(200).json({
        data:updateduser
    })
}

module.exports.updatePassword = async(req, res) => {
    try{
        const id = req.params.id;
                const {password} = req.body;
                const updateduser = await User.findByIdAndUpdate(id, {password});
    }catch(err){
        console.log(err);
    }

    req.status(200).json({
        message:"password updated successfully"
    })
};
// 
module.exports.login = async(req, res) => {
    console.log('running');
    console.log(req.body);
     const {email, password} = req.body;
  
   
     const user = await User.find({email});
//  user is an array of objects

        if(user.length === 0 ){
            console.log('user does not exist');
            res.status(200).json({
                data:"User does not exist"
            })
            return;
        }


    
     console.log(password ,user[0].password );
    //  this compare function is comparing the password entered by user and the hashed password stored in database
    
    // status is a boolean value
    const status =  await bcrypt.compare(password, user[0].password);
    if(status){

        console.log('user logged in successfully');
        res.status(200).json({
            name:user[0].name,
            email:user[0].email,
            designation:user[0].designation,
            token:generateToken(user._id)
        })
        return;
    }
 res.status(200).json({
        data:"User logged in successfully"
 })
};