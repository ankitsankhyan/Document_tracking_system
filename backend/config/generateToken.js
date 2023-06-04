const jwt = require('jsonwebtoken');

const generateToken = (id)=>{
    return jwt.sign({id}, 'docuemnt-tracking-system', {
        expiresIn:"30d"
    })
}

module.exports =generateToken;