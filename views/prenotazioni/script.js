function selectDay(day) {
    const selectedButton = document.querySelector(`button[data-day="${day}"]`);
    const isSelected = selectedButton.classList.contains('active');
  
    if (isSelected) {
      selectedButton.classList.remove('active');
    } else {
      selectedButton.classList.add('active');
    }
}
  
function saveWorkingHours() {
    const selectedDayButtons = document.querySelectorAll('.time-button.active');
    const startTimeSelect = document.getElementById('start-time');
    const endTimeSelect = document.getElementById('end-time');
  
    const workingHours = [];
  
    selectedDayButtons.forEach(button => {
      const day = button.getAttribute('data-day');
      const startTime = startTimeSelect.value;
      const endTime = endTimeSelect.value;
  
      const workingHour = {
        day: day,
        start: startTime,
        end: endTime
      };
  
      workingHours.push(workingHour);
    });
  
    // Effettua una richiesta al backend per salvare i dati selezionati
    // Utilizza i valori di workingHours nella richiesta
    fetch('/save-working-hours', {
      method: 'POST',
      body: JSON.stringify(workingHours),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => {
      console.log('Dati salvati con successo:', data);
      // Esegui altre azioni o aggiornamenti dell'interfaccia utente come necessario
    })
    .catch(error => {
      console.error('Si è verificato un errore durante il salvataggio dei dati:', error);
    });
}
  


// CALENDARIO
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


// CALENDARIO
let calendar = document.querySelector('.calendar')

const month_names = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

isLeapYear = (year) => {
    return (year % 4 === 0 && year % 100 !== 0 && year % 400 !== 0) || (year % 100 === 0 && year % 400 ===0)
}

getFebDays = (year) => {
    return isLeapYear(year) ? 29 : 28
}

generateCalendar = (month, year) => {

    let calendar_days = calendar.querySelector('.calendar-days')
    let calendar_header_year = calendar.querySelector('#year')

    let days_of_month = [31, getFebDays(year), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

    calendar_days.innerHTML = ''

    let currDate = new Date()
    if (month > 11 || month < 0) month = currDate.getMonth()
    if (!year) year = currDate.getFullYear()

    let curr_month = `${month_names[month]}`
    month_picker.innerHTML = curr_month
    calendar_header_year.innerHTML = year

    // get first day of month
    
    let first_day = new Date(year, month, 1)

    for (let i = 0; i <= days_of_month[month] + first_day.getDay() - 1; i++) {
        let day = document.createElement('div')
        if (i >= first_day.getDay()) {
            day.classList.add('calendar-day-hover')
            day.innerHTML = i - first_day.getDay() + 1
            day.innerHTML += `<span></span>
                            <span></span>
                            <span></span>
                            <span></span>`
            if (i - first_day.getDay() + 1 === currDate.getDate() && year === currDate.getFullYear() && month === currDate.getMonth()) {
                day.classList.add('curr-date')
            }
        }
        calendar_days.appendChild(day)
    }
}

let month_list = calendar.querySelector('.month-list')

month_names.forEach((e, index) => {
    let month = document.createElement('div')
    month.innerHTML = `<div data-month="${index}">${e}</div>`
    month.querySelector('div').onclick = () => {
        month_list.classList.remove('show')
        curr_month.value = index
        generateCalendar(index, curr_year.value)
    }
    month_list.appendChild(month)
})

let month_picker = calendar.querySelector('#month-picker')

month_picker.onclick = () => {
    month_list.classList.add('show')
}

let currDate = new Date()

let curr_month = {value: currDate.getMonth()}
let curr_year = {value: currDate.getFullYear()}

generateCalendar(curr_month.value, curr_year.value)

document.querySelector('#prev-year').onclick = () => {
    --curr_year.value
    generateCalendar(curr_month.value, curr_year.value)
}

document.querySelector('#next-year').onclick = () => {
    ++curr_year.value
    generateCalendar(curr_month.value, curr_year.value)
}
