const mongoose = require('mongoose');

const connectDB = async() =>{
    try{
        const conn = await mongoose.connect('mongodb+srv://ankitsankhyan04:iwtgts1005@cluster0.6udvigb.mongodb.net/?retryWrites=true&w=majority',{
            useNewUrlParser:true,
            useUnifiedTopology:true,
          
        });
        console.log(`MongoDB connected : ${conn.connection.host}`);
    }catch(error){
        console.log(`ERROR: ${error.message}`);
        process.exit();
    }
}

module.exports = connectDB;