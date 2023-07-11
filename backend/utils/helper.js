const crypto = require('crypto');

module.exports.generateRandomBytes = async () => {
return new Promise((resolve, reject) => {
       crypto.randomBytes(30, (err, buffer) => {
         if(err){
              reject(err);
            }
            resolve(buffer.toString('hex'));
        });
});

};



