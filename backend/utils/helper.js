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

exports.uploadImageToCloud = async (file) => {
  const { secure_url: url, public_id } = await cloudinary.uploader.upload(
    file,
    { gravity: "face", height: 500, width: 500, crop: "thumb" }
  );

  return { url, public_id };
};

