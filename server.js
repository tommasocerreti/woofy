const express = require('express');
const app = express();

const path = require('path');
const nodemailer = require('nodemailer');



app.use(express.static(__dirname + '/public'));



app.get('/', function(req, res) {
  res.sendFile(__dirname + '/public/home/home.html');
});

app.get('/prenotazioni.html', function(req, res) {
  res.sendFile(__dirname + '/public/prenotazioni/prenotazioni.html');
});

app.get('/prenota.html', function(req, res) {
  res.sendFile(__dirname + '/public/prenota/prenota.html');
});

app.get('/prenota.html', function(req, res) {
  res.sendFile(__dirname + '/public/prenota/prenota.html');
});

app.get('/login.html', function(req, res) {
  res.sendFile(__dirname + '/public/login/login.html');
});

app.get('/registrazione.html', function(req, res) {
  res.sendFile(__dirname + '/public/registrazione/registrazione.html');
});





app.use(express.static(path.join(__dirname, "public")));

app.set('port', 3000);

app.listen(3000, function () {
  console.log('Server listening on port ' + app.get('port'));
});


