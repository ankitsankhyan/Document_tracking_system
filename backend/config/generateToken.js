const jwt = require('jsonwebtoken');

const generateToken = (id)=>{
    // here id is payload
    return jwt.sign({id}, 'docuemnt-tracking-system', {
        expiresIn:"30d"
    })
}

module.exports =generateToken;