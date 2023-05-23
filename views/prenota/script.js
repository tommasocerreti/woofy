function prenotaButtonClicked(event) {
  event.preventDefault(); // Evita il comportamento predefinito del pulsante

  // Ottieni i valori desiderati
  var user_id1 = event.target.getAttribute('data-professional-id');
  var date = document.querySelector('input[name="date"]').value;
  var time = document.querySelector('select[name="time"]').value;

  // Crea un oggetto con i valori da inviare al server
  var data = {
    user_id1: user_id1,
    date: date,
    time: time
  };

  // Invia i dati al server utilizzando la fetch
  fetch('/prenotazione', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => response.json())
    .then(data => {
      console.log('Risposta del server:', data);
      // Esegui altre azioni o aggiornamenti dell'interfaccia utente come necessario
    })
    .catch(error => {
      console.error('Si è verificato un errore durante l\'invio dei dati:', error);
    });
}

// Aggiungi un gestore di eventi a tutti i pulsanti con la classe "book-btn"
var bookButtons = document.querySelectorAll('.book-btn');
for (var i = 0; i < bookButtons.length; i++) {
  bookButtons[i].addEventListener('click', prenotaButtonClicked);
}
