const nodemailer = require('nodemailer');

const generateMailTransporter =()=>{
  console.log(process.env.Nodemailer_user);
  console.log(process.env.Nodemailer_pass);
  return  nodemailer.createTransport({
        service:'gmail',
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: 'doctracksys@gmail.com',
            pass: 'kpvpfyctwzqidldd'
          }
    })
}

module.exports = {
    generateMailTransporter
}

// q: what is secure attribute in createTransport
// ans:
