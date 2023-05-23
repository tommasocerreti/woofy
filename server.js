const express = require('express');
const app = express();
const path = require('path');
const nodemailer = require('nodemailer');
const connection = require('./db');
const bodyParser = require('body-parser');
const validator = require('validator');
const session = require('express-session');
const handlebars = require('handlebars');


// CONFIGURAZIONE DEL MIDDLEWARE DI SESSIONE IN EXPRESS
app.use(session({
  secret: 'segreto',
  resave: false,
  saveUninitialized: true
}));

// Middleware per il controllo di autenticazione
function requireLogin(req, res, next) {
  if (req.session.user) {
    // L'utente è autenticato, procedi all'accesso alla pagina richiesta
    next();
  } else {
    // L'utente non è autenticato, reindirizza a login
    res.redirect('/login');
  }
}

// Esempio di utilizzo del middleware per la protezione di una pagina
app.get('/pagina-protetta', requireLogin, function(req, res) {
  // La pagina protetta può essere accessibile solo se l'utente è autenticato
  res.render('pagina-protetta');
});



// GESTIONE FILE STATICI
app.use(express.static(__dirname + '/views'));
app.use(express.static(path.join(__dirname, "views")));

// CONFIGURAZIONE DI BODY PARSER
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// CONFIGURAZIONE DI ejs
app.engine('ejs', require('ejs').__express);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));



// IMPOSTAZIONE UTENTE LOGGATO + FUNZIONE LOGOUT
app.get('/', function(req, res) {
  const loggedIn = req.session.user ? true : false;
  let profession = null;
  if (req.session.user && req.session.user.profession) {
    profession = req.session.user.profession;
  }
  res.render(path.join(__dirname, 'views', 'home', 'home.ejs'), { loggedIn, profession });
});

app.get('/prenotazioni', requireLogin, function(req, res) {
  const loggedIn = req.session.user ? true : false;
  let profession = null;
  if (req.session.user && req.session.user.profession) {
    profession = req.session.user.profession;
  }
  res.render(path.join(__dirname, 'views', 'prenotazioni', 'prenotazioni.ejs'), { loggedIn, profession });
});

app.get('/prenota', requireLogin, function(req, res) {
  const loggedIn = req.session.user ? true : false;
  res.render(path.join(__dirname, 'views', 'prenota', 'prenota.ejs'), { loggedIn });
});

app.get('/logout', function(req, res) {
 req.session.destroy(function(err) {
    if (err) {
      console.error('Errore durante la distruzione della sessione:', err);
      return res.status(500).send('Si è verificato un errore durante il logout.');
    }

    console.log('Logout effettuato con successo.');
    res.redirect('/');
  });
});


// ROUTE
app.get('/prenotazioni', function(req, res) {
  res.render(path.join(__dirname, 'views', 'prenotazioni', 'prenotazioni.ejs'));
});
app.get('/prenota', function(req, res) {
  res.render(path.join(__dirname, 'views', 'prenota', 'prenota.ejs'));
});
app.get('/login', function(req, res) {
  res.render(path.join(__dirname, 'views', 'login', 'login.ejs'));
});
app.get('/registrazione', function(req, res) {
  res.render(path.join(__dirname, 'views', 'registrazione', 'registrazione.ejs'));
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


// REGISTRAZIONE
app.post('/registrazione', function(req, res) {
  const firstName = req.body.firstName;
  const secondName = req.body.secondName;
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const profession = req.body.profession;
  const city = req.body.city;
  const address = req.body.address;
  
  connection.query('SELECT * FROM user WHERE email = ?', [email], function(error, results) {
    // VERIFICA DELLA PRESENZA DELL'EMAIL NEL DATABASE
    if (error) {
      console.error('Errore durante la verifica dell\'email nel database:', error);
      return res.send('Si è verificato un errore durante la registrazione. Riprova più tardi.');
    }

    if (results.length > 0) {
      return res.send('L\'indirizzo email è già stato registrato.');
    }

    // INSERIMENTO DELL'UTENTE NEL DATABASE
    const newUser = {
      firstName: firstName,
      secondName: secondName,
      email: email,
      password: password,
      profession: profession,
      city: city,
      address: address,
    };

    connection.query('INSERT INTO user (first_name, secondName, email, password, profession, city, address) VALUES (?, ?, ?, ?, ?, ?, ?)', 
              [newUser.firstName, newUser.secondName, newUser.email, newUser.password, newUser.profession, newUser.city, newUser.address], function(error, results) {
      if (error) {
        console.error('Errore durante l\'inserimento dell\'utente nel database:', error);
        return res.send('Si è verificato un errore durante la registrazione. Riprova più tardi.');
      }
      res.redirect('/');
    });
  });
});

// LOGIN
app.post('/login', function(req, res) {
  const email = req.body.email;
  const password = req.body.password;

  // Esegui una query per verificare se esiste un utente con l'email fornita
  connection.query('SELECT * FROM user WHERE email = ?', [email], function(error, results) {
    if (error) {
      console.error('Errore durante la ricerca dell\'utente nel database:', error);
      return res.status(500).send('Si è verificato un errore durante la ricerca dell\'utente nel database.');
    }

    // Verifica se l'utente esiste
    if (results.length === 0) {
      return res.status(401).send('Email o password non validi.');
    }

    // L'utente esiste, verifica la password
    const user = results[0];
    if (password === user.password) {
      // Password corretta, avvia la sessione o restituisci un messaggio di successo
      req.session.user = user;
      return res.redirect('/'); // Reindirizza all'area riservata o invia un messaggio di successo
    } else {
      // Password non valida
      return res.status(401).send('Email o password non validi.');
    }
  });
});



// RICERCA DEL PROFESSIONISTA NELLA PAGINA PRENOTA
app.post('/prenota', function(req, res) {
  const profession = req.body.profession;
  console.log('Valore profession:', profession);

  connection.query('SELECT * FROM User WHERE profession = ?', [profession], async function(error, results) {
    if (error) {
      console.error('Errore durante la ricerca dei professionisti:', error);
      return res.status(500).send('Si è verificato un errore durante la ricerca dei professionisti.');
    }

    try {
      console.log(results);

      if (!results || results.length === 0) {
        return res.render('prenota/prenota', { professionals: [], professione: profession });
      }

      res.render('prenota/prenota', { professionals: results, professione: profession });
    } catch (error) {
      console.error('Si è verificato un errore durante la ricerca dei professionisti:', error);
      res.status(500).send('Si è verificato un errore durante la ricerca dei professionisti.');
    }
  });
});



// AVVIAMENTO SERVER
app.set('port', 3000);
app.listen(3000, () => {
  console.log('Server listening on port ' + app.get('port'));
});
