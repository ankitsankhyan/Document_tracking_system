const mongoose = require('mongoose')
const Users = require('./user');
const Document = require('./document');

const authorization_table =  new mongoose.Schema({
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:Users
    },
    doc_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:document
    }
    

});


module.exports = mongoose.Model('authorization_table', authorization_table);
