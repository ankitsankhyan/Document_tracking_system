const User = require('../Model/user');
const bcrypt = require('bcryptjs');
const generateToken = require('../config/generateToken');
module.exports.createUser = async(req, res)=>{
  
   
   
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
        const {name,email,password} = req.body;
        const user = await User.find({email});
        if(user.length === 0 ){
            res.status(200).json({
                message:'User does not exist'
            });
            return;
        }
        const status = await bcrypt.compare(password, user[0].password);
        if(status){
            user[0].name = name;
            user[0].email = email;
            user[0].save();
            res.status(200).json({
                message:'User updated successfully',
                data:{
                    name:user[0].name,
                    email:user[0].email,
                    designation:user[0].designation

                }
            });
            return;
        }
       
    }catch(err){
        console.log(err);
    }
   
    res.status(200).json({
        data:updateduser
    })
}



module.exports.updatePassword = async(req, res) => {
    try{
    
        const {email, password} = req.body;
        console.log(email);
        const user = await User.find({email});
        if(user.length === 0 ){
            res.status(200).json({
                message:'User does not exist'
            });
            return;
        }

        
             user[0].password = password;
            await user[0].save();

            res.status(200).json({
                message:"password updated successfully"
            })
                       
    }catch(err){
        console.log(err);
    }

 
};


// login function
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
    }else{
        res.status(400).json({
            message:'Invalid credentials'
        })
    }

};