const express = require('express');
const app = express();

const path = require('path');
const nodemailer = require('nodemailer');

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/public/home/home.html');
});

app.use(express.static(path.join(__dirname, "public")));

app.set('port', 3000);

app.listen(3000, function () {
  console.log('Server listening on port ' + app.get('port'));
});


