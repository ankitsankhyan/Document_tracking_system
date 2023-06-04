const User = require('../Model/user');

module.exports.createUser = async(req, res)=>{
    console.log('running');
     console.log(req.body);
   
    try{
        const {name,email, password,designation} = req.body;
        const user = User.findOne({email:email});
     
        // if(user){
        //     res.status(200).json({
        //         message:'User already exists'
        //     });
        //     return;
        // }
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

module.exports.login = async(req, res) => {


};