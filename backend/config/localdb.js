const mongoose = require('mongoose');


mongoose.connect('mongodb://mongodb/document_tracking_system_development');


const db = mongoose.connection;

db.on('error',  console.error.bind (console, "error connecting to database"));
db.once('open', function () {
    console.log('connected to database successfully');
})

module.exports = db;