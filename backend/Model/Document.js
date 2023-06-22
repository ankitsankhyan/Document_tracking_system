const mongoose = require('mongoose');
const User = require('./user');

var data = new mongoose.Schema({
    title:{
        type:String,
        require:true
    },
    description:{
        type:String,
        
    },

    timeline:{
        type: Array,
        default: []
        
    }
    ,
    section:{
        type:String,
        enum:['Library','Registrar','Accounts','Academics','infra','Public', 'Personal'],
        required:true

    },
   
    signature:{
       type:Array,
       default:[]
    },
    signed_by:{
        type:Array,
        default:[]
    },
 
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref: User ,
        required:true
       
    },
    approved:{
        type:String,
        default:false
    },
    time:{
        type:Date,
        default: new Date()
    }

});

data.methods.isDeletable = function(){
    const currentTime = new Date();
    const creationTime = new Date(this.time);
  
    const timeDifference = currentTime - creationTime;
    const oneDayInMillis = 86400000 // 1 day in milliseconds
    console.log(timeDifference);
  
    if (timeDifference > oneDayInMillis) {
      return false;
    } else {
      return true;
    }

}
const document = mongoose.model('Document', data);


module.exports = document;