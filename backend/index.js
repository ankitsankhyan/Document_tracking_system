const express = require('express');
const app = express();
const routes = require('./router/index');
const db = require('./config/localdb');

// Parse JSON bodies
app.use(express.json());

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));
app.use('/',routes);
const port = 8000;



app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})
// q:adding remote link to this project
// q: git push 


