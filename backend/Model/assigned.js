const mongoose = require('mongoose');
const Users = require('./user');
const Document = require('./document');
// here senderId is the user who is sending sending a request to the dispatcher
const assignment_table =  new mongoose.Schema({
    document_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:Document
    },
    dispatcher_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:Users
    },
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:Users
    },
      assigned:{
        type:boolean,
        default:false
    }

});

const assignment = mongoose.model('assignment_table', assignment_table);

module.exports = assignment;
