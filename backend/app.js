const express = require('express');

const app = express();

app.use((req, res, next)=> {
  console.log('1st');
    next();
});
//next is to tell it to go on to the next function

app.use((req, res, next)=> {
  res.send('hello from express');
});

module.exports = app;
