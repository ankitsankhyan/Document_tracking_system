const mongoose = require('mongoose');
const user = require('user');
const document = require('document');
const Tag = new mongoose.Schema({
    tagged_from:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
    }, 
    
    tagged_to:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
},

    document_id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Document'
    },
    seen:{
        type: Boolean,
        default: false
    }},{
        timestamps:true
    }
)

var tag = mongoose.Model('Tag',Tag);

module.exports = tag;