const User = require("../Model/user");
const Document = require("../Model/document");
const bcrypt = require("bcryptjs");
const rsa = require("node-rsa");
const generateToken = require("../config/generateToken");
const NodeRSA = require("node-rsa");
const {generateRandomBytes} = require("../utils/helper");
const PasswordResetToken = require("../Model/passwordResetToken");
const { generateMailTransporter } = require("../utils/mail");
const passwordResetToken = require("../Model/passwordResetToken");
module.exports.createUser = async (req, res) => {
 
  
    console.log(req.body);
    const { name, email, password, designation,section } = req.body;
    const user = await User.findOne({ email: email });
    console.log(user);
    if (user) {
      res.status(400).json({
        message: "User already exists",
      });
      return;
    }

 
  
            const newUser = await User.create({
                                                name: name,
                                                email: email,
                                                password: password,
                                                designation: designation,
                                                section: section,
                                             
            });

    res.status(200).json({
      data: newUser,
    });
  
};

module.exports.updateCredentials = async (req, res) => {
 
  
    const { name, email, password, designation,section } = req.body;
    console.log(req.body);
    if(req.user.email !== email){
      res.status(401).json({
        message: "You are not authorized to update this user",
      });
      return;
    }
    const user = await User.find({ email });
    if (user.length === 0) {
      res.status(200).json({
        message: "User does not exist",
      });
      return;
    }
    const status = await bcrypt.compare(password, user[0].password);
    if (status) {
      user[0].name = name;
      user[0].email = email;
      user[0].designation = designation;
      user[0].section = section;
      user[0].save();
      res.status(200).json({
        message: "User updated successfully",
        data: {
          name: user[0].name,
          email: user[0].email,
          designation: user[0].designation,
          section:user[0].section,
        },
      });
      return;
    }
 
  

  res.status(200).json({
    data: updateduser,
  });
};

module.exports.updatePassword = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email);
    const user = await User.find({ email });
    if (user.length === 0) {
      res.status(200).json({
        message: "User does not exist",
      });
      return;
    }

    user[0].password = password;
    await user[0].save();

    res.status(200).json({
      message: "password updated successfully",
    });
  } catch (err) {
    console.log(err);
  }
};

// login function
module.exports.login = async (req, res) => {

  console.log(req.body);
  const { email, password } = req.body;
console.log(email);
  const user = await User.find({ email });
  //  user is an array of objects
  console.log(user);
  if (user.length === 0) {
    console.log("user does not exist");
    res.status(200).json({
      data: "User does not exist",
    });
    return;
  }

  //  this compare function is comparing the password entered by user and the hashed password stored in database

  // status is a boolean value
  const status = await bcrypt.compare(password, user[0].password);
  console.log(user[0]._id, user[0].id);
  if (status) {
    console.log("user logged in successfully");
    res.status(200).json({
      name: user[0].name,
      email: user[0].email,
      designation: user[0].designation,
      section:user[0].section,
      token: generateToken(user[0].id),
    });
    return;
  } else {
    res.status(400).json({
      message: "Invalid credentials",
    });
  }
};

module.exports.generatePublicKey = async (req, res) => {
  
        const {email} =  req.user;
        const {password} = req.body;
      
        const originalUser = await User.findOne({email : email});
        console.log(password,originalUser.password);
        const isMatch = await bcrypt.compare(password,originalUser.password);
        if(!isMatch){
          res.status(200).json({
            message : "Password is not correct"
          });
          return;
          
        }
        if(originalUser.hasPrivateKey === true){
          res.status(200).json({
            message : "Public key is already generated"
          });
          return;
        }
        const key = new rsa().generateKeyPair();
        const public_key = key.exportKey("public");
        const private_key = key.exportKey("private");
        originalUser.publicKey = public_key;
        originalUser.hasPrivateKey = true;
        await originalUser.save();
        res.status(200).json({
          private_key : private_key,
          message : "Please Store the private key in a safe place"
        });
         
};

module.exports.getProfile = async (req,res) => {
     const id = req.params.id;
     const user = await User.findById(id);
      if(!user){
        res.status(401).json({
          message : "User does not exist"
        })
        return;
      }

      res.status(200).json({
        name : user.name,
        email : user.email,
        designation : user.designation,
        section : user.section
      })

}

// password verification
module.exports.generatelink = async (req, res) => {
  const {email} = req.body;
  const token = await generateRandomBytes();
  
  const user = await User.findOne({email : email});
  if(!user){
    res.status(400).json({
      message : "User does not exist"
    });
    return;
  }
  const availtoken = await PasswordResetToken.deleteMany({userId : user._id});

  // deleting token if already exists



  const passwordResetToken = await PasswordResetToken.create({
    token : token,
    userId : user._id,
   
  });
  const link = `http://localhost:3000/resetpassword?token=${token}&user_id=${user._id}`;
  
  const transporter = generateMailTransporter();
  transporter.sendMail({
    from:'doctracksys@gmail.com',
    to:'ankitsankhyan04@gmail.com',
    subject:'Reset Password Link',
    html:`
    <p> Click here to reset password</p>
    <a href = '${link}'> Change Password</a> `,

  })

  res.status(200).json({
    message : "Password reset link has been sent to your email",
    link:link
  });


};

module.exports.verifyLink = async(req, res)=>{
   res.status(200).json({
        message:'user is authorised'
   })
}

module.exports.resetPassword = async(req, res)=>{
   const {password, confirmPassword} = req.body;
   if(password !== confirmPassword){
     req.status(200).json({
        message : "Password and confirm password does not match"
      });
   }

   const updateUser = await User.findByIdAndUpdate(req.user._id,{
    ...req.user,password : password
   })
  await PasswordResetToken.findOneAndDelete({userId : req.user._id});
  res.status(200).json({
    message : "Password reset successfully",
    user: updateUser
  });
}
