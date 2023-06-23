const mongoose = require('mongoose')
const Users = require('./user');
const Document = require('./document');

const authorization_table =  new mongoose.Schema({
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:Users
    },
    document_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:Document
    }
    

});
// 
authorization_table.index({user_id:1,document_id:1},{unique:true});

module.exports = mongoose.model('authorization_table', authorization_table);
