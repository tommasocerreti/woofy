const express = require('express');
const app = express();
const path = require('path');
const nodemailer = require('nodemailer');
const connection = require('./db');


// ROUTE
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

app.get('/bootstrap.min.css', function(req, res) {
  res.sendFile(__dirname + '/node_modules/bootstrap/dist/css/bootstrap.min.css');
});
app.get('/bootstrap-icons.css', function(req, res) {
  res.sendFile(__dirname + '/node_modules/bootstrap-icons/font/bootstrap-icons.css');
});
app.get('/bootstrap.min.js', function(req, res) {
  res.sendFile(__dirname + '/node_modules/bootstrap/dist/js/bootstrap.min.js');
});
app.get('/bootstrap.min.css.map', function(req, res) {
  res.sendFile(__dirname + '/node_modules/bootstrap/dist/css/bootstrap.min.css.map');
});
app.get('/bootstrap.min.js.map', function(req, res) {
  res.sendFile(__dirname + '/node_modules/bootstrap/dist/js/bootstrap.min.js.map');
});


// GESTIONE FILE STATICI
app.use(express.static(__dirname + '/public'));
app.use(express.static(path.join(__dirname, "public")));


// AVVIAMENTO SERVER
app.set('port', 3000);
app.listen(3000, () => {
  console.log('Server listening on port ' + app.get('port'));
});