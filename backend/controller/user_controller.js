const User = require("../Model/user");
const Document = require("../Model/document");
const bcrypt = require("bcryptjs");
const rsa = require("node-rsa");
const generateToken = require("../config/generateToken");
const NodeRSA = require("node-rsa");
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
      token: generateToken(user[0].id),
    });
    return;
  } else {
    res.status(400).json({
      message: "Invalid credentials",
    });
  }
};

const verifysignature =  (email, publicKey, signature) => {
      
  const public_key_func = new rsa();
  public_key_func.importKey(publicKey, "public");
  const decrypted =  public_key_func.decryptPublic(signature, "utf8");
  if (decrypted === email) {
          return true;
  } else {
    return false;
  }

};

module.exports.verifyDocument = async (req, res) => {
       const {doc_id} = req.body;
        const document = await Document.findById(doc_id);
        const {signed_by,signature} = document;
        console.log(signed_by);
        for(let i = 0;i<signed_by.length;i++){
          const user = await User.find({email :signed_by[i].email});
           for(let j = 0; j < signature.length;j++){
               const status = verifysignature(user[0].email,user[0].publicKey,signature[j].signature);
                if(status === false){
                  res.status(200).json({
                    message : "Document sign for user" + user[0].email + "is not verified"
                  });
                  return;
                }
           }
        }

        res.status(200).json({
          message : "All document's signature are verified"
        });

};

module.exports.generatePublicKey = async (req, res) => {
        const {email} =  req.user;
        const {password} = req.body;
       
        const originalUser = await User.findOne({email : email});
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