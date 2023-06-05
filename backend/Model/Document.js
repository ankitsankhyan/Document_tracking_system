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
    initiatedBy:{
        type:String,
        enum:['External'],
        required:function () {
            return !this.createdBy;
          }

    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref: User ,
        required:function(){
            return !this.initiatedBy; 
        }
       
    },
    approved:{
        type:Boolean,
        default:false
    }

},
    
    {
        timestamps:true
    }
);

const document = mongoose.model('Document', data);


module.exports = document;