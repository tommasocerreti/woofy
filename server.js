const express = require('express');
const app = express();
const path = require('path');
const nodemailer = require('nodemailer');
const connection = require('./db');
const bodyParser = require('body-parser');
const validator = require('validator');
const session = require('express-session');
const handlebars = require('handlebars');
const cookierParser = require('cookie-parser');


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


// SET COOKIES
app.use(cookierParser());
app.use(async function (req, res, next) {
  if (req.cookies['userID'] === undefined) {
    res.cookie('userID', 'NULL');
    console.log('Start Cookie created successfully');
  } else {
    console.log('Cookie already exists', req.cookies);
  }
  next();
});



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

    connection.query('INSERT INTO user (firstName, secondName, email, password, profession, city, address) VALUES (?, ?, ?, ?, ?, ?, ?)', 
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
      res.cookie('userID',user.id);
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

// INSERIMENTO ORARI DISPONIBILI
app.post('/save-working-hours', (req, res) => {
  const userId = req.cookies['userID'];
  const startFields = ['start_mon', 'start_tue', 'start_wed', 'start_thu', 'start_fri', 'start_sat', 'start_sun'];
  const finishFields = ['finish_mon', 'finish_tue', 'finish_wed', 'finish_thu', 'finish_fri', 'finish_sat', 'finish_sun'];

  const selectedDays = req.body; // Array dei giorni selezionati

  // Check if a row exists for the user
  connection.query('SELECT * FROM working_hours WHERE user_id = ?', [userId], (error, results) => {
    if (error) {
      console.error('Errore durante la ricerca delle ore lavorative:', error);
      res.status(500).json({ error: 'Si è verificato un errore durante la ricerca delle ore lavorative.' });
    } else {
      if (results.length > 0) {
        // A row already exists for the user, perform an UPDATE
        let query = 'UPDATE working_hours SET ';
        let values = [];

        for (let i = 0; i < startFields.length; i++) {
          const startField = startFields[i];
          const finishField = finishFields[i];

          const selectedDay = selectedDays.find(day => day.day === startField.replace('start_', ''));
          if (selectedDay) {
            const { start, end } = selectedDay;
            query += `${startField} = ?, ${finishField} = ?, `;
            values.push(start, end);
          } else {
            query += `${startField} = ?, ${finishField} = ?, `;
            values.push(null, null);
          }
        }

        query = query.slice(0, -2); // Remove the extra comma and space at the end
        query += ' WHERE user_id = ?';
        values.push(userId);

        // Execute the UPDATE query
        connection.query(query, values, (error, results) => {
          if (error) {
            console.error('Errore durante l\'aggiornamento delle ore lavorative:', error);
            res.status(500).json({ error: 'Si è verificato un errore durante l\'aggiornamento delle ore lavorative.' });
          } else {
            console.log('Ore lavorative aggiornate con successo.');
            res.status(200).json({ success: true });
          }
        });
      } else {
        // No row exists for the user, perform an INSERT INTO
        let query = 'INSERT INTO working_hours (user_id';
        let values = [userId];

        for (let i = 0; i < startFields.length; i++) {
          const startField = startFields[i];
          const finishField = finishFields[i];

          const selectedDay = selectedDays.find(day => day.day === startField.replace('start_', ''));
          if (selectedDay) {
            const { start, end } = selectedDay;
            query += `, ${startField}, ${finishField}`;
            values.push(start, end);
          } else {
            query += `, ${startField}, ${finishField}`;
            values.push(null, null);
          }
        }

        query += ') VALUES (?';
        for (let i = 0; i < startFields.length * 2; i++) {
          query += ', ?';
        }
        query += ')';

        // Execute the INSERT INTO query
        connection.query(query, values, (error, results) => {
          if (error) {
            console.error('Errore durante l\'inserimento delle ore lavorative:', error);
            res.status(500).json({ error: 'Si è verificato un errore durante il salvataggio delle ore lavorative.' });
          } else {
            console.log('Ore lavorative salvate con successo.');
            res.status(200).json({ success: true });
          }
        });
      }
    }
  });
});



// PRENOTAZIONE
app.post('/prenotazione', (req, res) => {
  console.log('Gestore di route /prenotazione raggiunto');
  const user_id1 = req.body.user_id1;
  const user_id2 = req.cookies['userID'];
  const date = req.body.date;
  const time = req.body.time;
  const day = req.body.day;

  const start_day = 'start_' + req.body.day;
  const finish_day = 'finish_' + req.body.day;

  console.log(user_id1, user_id2, date, time, day);

  // ESISTE PRENOTAZIONE?
  const query = `SELECT * FROM booking WHERE user_id1 = ? AND date = ? AND time = ?`;

  connection.query(query, [user_id1, date, time], (error, results) => {
    if (error) {
      console.error('Errore durante l\'esecuzione della query:', error);
      res.status(500).json({ error: 'Errore del server' });
    } else {
      if (results.length > 0) {
        // Esiste già una prenotazione con i dati specificati
        console.log("Gia esiste");
        res.status(409).json({ error: 'Prenotazione duplicata' });
      } else {
        console.log('ESISTE PRENOTAZIONE?');


        // QUALI SONO I VALORI start e finish?
        const workingHoursQuery = `SELECT ${start_day}, ${finish_day} FROM working_hours WHERE user_id = ?`;
        connection.query(workingHoursQuery, [user_id1], (error, workingHoursResults) => {
          if (error) {
            console.error('Errore durante l\'esecuzione della query:', error);
            res.status(500).json({ error: 'Errore del server' });
          } else {
            if (workingHoursResults.length > 0) {
              var startDayValue = workingHoursResults[0][start_day]; // Ottieni il valore di start_day
              var finishDayValue = workingHoursResults[0][finish_day]; // Ottieni il valore di finish_day

              console.log('QUALI SONO I VALORI start e finish?');
              console.log(startDayValue, finishDayValue);
              



              // QUELL'ORARIO É COMPRESO TRA QUELLI DISPONIBILI?
             {
              if (time >= startDayValue && time <= finishDayValue) {
                  // Entrambi i controlli passati, procedi con l'inserimento
                  const insertQuery = `INSERT INTO booking (user_id1, user_id2, date, time) VALUES (?, ?, ?, ?)`;
                  console.log("Fenomeno");
                  connection.query(insertQuery, [user_id1, user_id2, date, time], (error) => {
                    if (error) {
                      console.error('Errore durante l\'inserimento della prenotazione:', error);
                      res.status(500).json({ error: 'Errore del server' });
                    } else {
                      console.log('QUELLORARIO É COMPRESO TRA QUELLI DISPONIBILI?444444444');
                      res.status(200).json({ success: true });
                    }
                  });
                } 
                
              };
            } else {
              // Nessun risultato trovato per i valori start_day e finish_day
              res.status(409).json({ error: 'Orario non disponibile' });
            }
          }
          
        });
      }
    }
  });
});


/*
app.post('/prenotazione', (req, res) => {

  console.log('Gestore di route /prenotazione raggiunto');
  const user_id1 = req.body.user_id1;
  const user_id2 = req.cookies['userID'];
  const date = req.body.date;
  const time = req.body.time;
  const day = req.body.day;

  const start_day = 'start_' + req.body.day;
  const finish_day = 'finish_' + req.body.day;
  

  console.log(user_id1, user_id2, date, time, day);


  // CHIAMATA PER CONTROLLO ORARI
  axios.post()


  // Esegui la query per verificare se esiste già una prenotazione
  const query = `SELECT * FROM booking WHERE user_id1 = ? AND user_id2 = ? AND date = ? AND time = ?`;

  connection.query(query, [user_id1, user_id2, date, time], (error, results) => {
    if (error) {
      console.error('Errore durante l\'esecuzione della query:', error);
      res.status(500).json({ error: 'Errore del server' });
    } else {
      if (results.length > 0) {
        // Esiste già una prenotazione con i dati specificati
        res.status(409).json({ error: 'Prenotazione duplicata' });
      } else {
        // Non esiste una prenotazione duplicata, procedi con l'inserimento
        const insertQuery = `INSERT INTO booking (user_id1, user_id2, date, time) VALUES (?, ?, ?, ?)`;
        connection.query(insertQuery, [user_id1, user_id2, date, time], (error) => {
          if (error) {
            console.error('Errore durante l\'inserimento della prenotazione:', error);
            res.status(500).json({ error: 'Errore del server' });
          } else {
            res.status(200).json({ success: true });
          }
        });
      }
    }
  });
});











app.post('/prenotazione', (req, res) => {
  console.log('Gestore di route /prenotazione raggiunto');
  const user_id1 = req.body.user_id1;
  const user_id2 = req.cookies['userID'];
  const date = req.body.date;
  const time = req.body.time;
  const day = req.body.day;

  const start_day = 'start_' + req.body.day;
  const finish_day = 'finish_' + req.body.day;

  console.log(user_id1, user_id2, date, time, day);

  // Esegui la query per verificare se esiste già una prenotazione e se il tempo è compreso tra start_day e finish_day
  const query = `SELECT * FROM booking WHERE user_id1 = ? AND user_id2 = ? AND date = ? AND time = ? AND ${time} >= ${start_day} AND ${time} <= ${finish_day}`;

  connection.query(query, [user_id1, user_id2, date, time], (error, results) => {
    if (error) {
      console.error('Errore durante l\'esecuzione della query:', error);
      res.status(500).json({ error: 'Errore del server' });
    } else {
      if (results.length > 0) {
        // Esiste già una prenotazione con i dati specificati
        res.status(409).json({ error: 'Prenotazione duplicata' });
      } else {
        // esce dalla post
        console.log("Orario disponibile");
        });
      }
    }
  });
});
*/


























// AVVIAMENTO SERVER
app.set('port', 3000);
app.listen(3000, () => {
  console.log('Server listening on port ' + app.get('port'));
});
