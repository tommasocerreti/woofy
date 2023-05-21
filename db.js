const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '12345678', // baduila96 , 12345678
  database: 'db_woofy'
});

connection.connect(function(err) {
  if (err) {
    console.error('Errore di connessione al database: ' + err.stack);
    return;
  }

  console.log('Connesso al database con ID connessione: ' + connection.threadId);
});

module.exports = connection;
