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
        enum:['Library','Registrar','Accounts','Academics','infra','others'],
        required:true

    },
    signature:{
       type:Array,
       default:[]
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref: User ,
        required:true
       
    },
    approved:{
        type:Boolean,
        default:false
    },
    time:{
        type:Date,
        default:Date.now()
    }

});

const document = mongoose.model('Document', data);


module.exports = document;