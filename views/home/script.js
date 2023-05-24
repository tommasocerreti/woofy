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
