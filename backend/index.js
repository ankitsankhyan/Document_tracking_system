const express = require('express');
const app = express();
require('express-async-errors');

const routes = require('./router/index');
const db = require('./config/localdb');
const morgan = require('morgan');
const cors = require('cors');

// Parse JSON bodies
app.use(express.json());

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use((err, req, res, next) => {
    if (err.message === 'access denied') {
      res.status(401);
      res.json({ error: err.message });
    }
});
app.use('/',routes);
const port = 8000;


app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})
// q:adding remote link to this project
// q: git push 


