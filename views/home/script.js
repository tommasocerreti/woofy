// SCRIPT PULSANTI HOME
document.addEventListener('DOMContentLoaded', function() {
  $(function() {
    $('.my-button:not(.disabled)').on('click', function() {
      const professione = $(this).data('professione');
      inviaRichiestaPOST(professione);
    });

    $('.my-button.disabled').on('click', function() {
      window.location.href = '/login'; // Reindirizzamento alla pagina di login
    });
  });

  function inviaRichiestaPOST(professione) {
    $('<form action="/prenota" method="post">' +
      '<input type="hidden" name="profession" value="' + professione + '">' +
      '</form>').appendTo('body').submit();
  }
});

// Funzione per calcolare il tempo rimanente fino alla prossima ora
function calculateTimeRemaining() {
  const now = new Date();
  const nextHour = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() + 1, 0, 0);
  const timeRemaining = nextHour - now;
  
  return timeRemaining;
}

// Funzione per aggiornare il countdown sulla pagina
function updateCountdown() {
  const countdownElement = document.getElementById('countdown');
  const timeRemaining = calculateTimeRemaining();
  const hours = 3;
  const minutes = Math.floor((timeRemaining / (1000 * 60)) % 60);
  const seconds = Math.floor((timeRemaining / 1000) % 60);

  countdownElement.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Aggiornamento iniziale del countdown
updateCountdown();

// Aggiornamento periodico ogni secondo
setInterval(updateCountdown, 1000);

/* Funzione per aggiornare il countdown
function updateCountdown(countdown) {
  var countdownElement = document.getElementById('countdown');
  countdownElement.innerHTML = countdown;
}

// Funzione per effettuare la richiesta al server e ottenere i dati del countdown
function getCountdownData() {
  var request = new XMLHttpRequest();
  request.open('POST', '/get-countdown', true); // Modifica l'URL dell'endpoint nel tuo server

  // Funzione da eseguire quando la richiesta viene completata
  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
      // La richiesta è stata completata con successo
      var data = JSON.parse(request.responseText);
      updateCountdown(data.countdown);
    } else {
      // Si è verificato un errore nella richiesta
      console.error('Si è verificato un errore nella richiesta al server.');
    }
  };

  // Gestisci un errore di connessione al server
  request.onerror = function() {
    console.error('Errore di connessione al server.');
  };

  // Invia la richiesta al server
  request.send();
}

// Chiamata iniziale per ottenere i dati del countdown quando il documento è pronto
document.addEventListener('DOMContentLoaded', function() {
  getCountdownData();
});





  function calculateCountdown(date, time) {
    var appointmentDate = new Date(date + ' ' + time);
    var currentDate = new Date();
  
    var countdown = appointmentDate - currentDate;
    // Esegui i calcoli per ottenere il countdown corretto
  
    // Restituisci una stringa formattata per il countdown
    return 'Countdown: ' + countdown + ' milliseconds';
  } */
  

