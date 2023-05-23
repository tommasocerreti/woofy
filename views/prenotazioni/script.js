$(document).ready(function() {
// Inizializza il mese corrente
var currentMonth = 5; // Giugno (0 = gennaio, 1 = febbraio, ecc.)

// Funzione per aggiornare l'interfaccia del calendario con il mese corrente
function updateCalendar() {
    var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    var $calendar = $('#calendar');
    $calendar.find('.cal-month-name').text(monthNames[currentMonth]);

    // ... Altre modifiche all'interfaccia del calendario ...
}

// Gestisci il click sul pulsante per andare al mese precedente
$('#calendar').on('click', '.cal-btn[data-direction="prev"]', function() {
    currentMonth--;
    updateCalendar();
});

// Gestisci il click sul pulsante per andare al mese successivo
$('#calendar').on('click', '.cal-btn[data-direction="next"]', function() {
    currentMonth++;
    updateCalendar();
});

// Inizializza il calendario con il mese corrente
updateCalendar();
});