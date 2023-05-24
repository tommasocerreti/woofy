function prenotaButtonClicked(event) {
  event.preventDefault(); // Evita il comportamento predefinito del pulsante

  var box = event.target.closest('.container-box'); // Trova il box genitore del pulsante su cui è stato fatto clic

  // Ottiene i valori desiderati all'interno del box specifico
  var user_id1 = event.target.getAttribute('data-professional-id');
  var date = box.querySelector('input[name="date"]').value;
  var time = box.querySelector('select[name="time"]').value;
  
  var dayNames = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  var dayOfWeek = new Date(date).getDay();
  var day = dayNames[dayOfWeek];

  var data = {
    user_id1: user_id1,
    date: date,
    time: time,
    day: day
  };

  console.log(data);

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
    })
    .catch(error => {
      console.error('Si è verificato un errore durante l\'invio dei dati:', error);
    });
}

// Gestore di eventi per tutti i pulsanti con la classe "book-btn"
var bookButtons = document.querySelectorAll('.book-btn');
for (var i = 0; i < bookButtons.length; i++) {
  bookButtons[i].addEventListener('click', prenotaButtonClicked);
}
