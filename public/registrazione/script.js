// NAVBAR - SCROLL
window.addEventListener('scroll', function() {
  var navbar = document.getElementById('navbar');
  if (window.pageYOffset > 0) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// RIDIMENSIONAMENTO
function setBodyScale() {
  const viewportWidth = window.innerWidth;
  const scale = Math.min(viewportWidth / 1000, 1);
  document.body.style.transform = `scale(${scale})`;
}

window.addEventListener('resize', setBodyScale);
setBodyScale();





// Gestore di eventi al tasto "Continua"
const registerButton = document.getElementById('registerButton');
registerButton.addEventListener('click', registerUser);

// Funzione per la registrazione degli utenti
function registerUser() {
  // Dati dal form
  const name = document.querySelector('input[name="name"]').value;
  const surname = document.querySelector('input[name="surname"]').value;
  const email = document.querySelector('input[name="email"]').value;
  const password = document.querySelector('input[name="password"]').value;
  const confirmPassword = document.querySelector('input[name="confirmPassword"]').value;





  // Verifica se le password coincidono (da vedere se va qui)
  if (password !== confirmPassword) {
    return res.send('Le password non corrispondono!');
  }





  // PROFESSIONE DA GESTIRE



  const taxCode = document.querySelector('input[name="taxCode"]').value;
  const city = document.querySelector('input[name="city"]').value;
  const address = document.querySelector('input[name="address"]').value;
  const cap = document.querySelector('input[name="cap"]').value;



  // Effettua le validazioni dei dati
  // ...

  // Verifica se l'indirizzo email esiste già nel database
  // ...

  // Effettua l'inserimento dei dati dell'utente nel database
  // ...

  // Gestisci gli errori
  // ...

  // Procedi con la registrazione dell'utente nel database
  // ...
  
  // Invia una risposta di conferma o reindirizza l'utente a una pagina successiva
  res.send('Registrazione completata con successo!');
}
