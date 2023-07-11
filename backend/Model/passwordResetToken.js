const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const ResetPasswordTokenSchema = new mongoose.Schema({
     userId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
     },
        token:{
            type: String,
            required: true
        }});

ResetPasswordTokenSchema.pre('save', function(next) {
    if(this.isModified('token')) {
        this.token = bcrypt.hashSync(this.token, 10);
    }
    next();
})

module.exports = mongoose.model('ResetPasswordToken', ResetPasswordTokenSchema);