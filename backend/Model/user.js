const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const user = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    designation: {
      type: String,
      enum: ["Admin", "Professor", "Dispatcher"],
      required: true
    },
    section:{
      type:String,
      enum:['Library','Registrar','Accounts','Academics','infra'],
      required:true
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    publicKey: {
      type: String,
      
    },
    hasPrivateKey: {
      type: Boolean,
      default: false,
    }

  },
  {
    timestamps: true,
  }
);

user.pre("save", async function (next) {
  //  this if ensures to check if data is modified only once
  if (this.isModified("password")) {
    console.log("running in pre function");

    const salt = await bcrypt.genSalt(10); // generates random string which is used to hash password

    this.password = await bcrypt.hash(this.password, salt);
    console.log(this.password);
    next();
  }
});
user.methods.matchPassword = async function (enterPassword) {
  return await bcrypt.compare(enterPassword, this.password);
};

const userSchema = mongoose.model("User", user);

module.exports = userSchema;
