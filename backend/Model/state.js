const mongoose = require('mongoose');

const user = require('user');
const document = require('document');

const state_schema = new mongoose.Schema({
    user_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    document_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'document'
    },
    received:{
        type: Boolean,
        default: false
    },
    done:{
        type: Boolean,
        default: false
    },
   time:{
       type: Date,
       default: new Date()
    
   }
})

const State = mongoose.Model('State', state_schema);

module.exports = State;