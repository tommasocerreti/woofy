document.getElementById("prenota-btn").addEventListener("click", function(event) {
    event.preventDefault(); // Evita il comportamento predefinito del pulsante di invio del modulo

    // Ottieni i valori del form
    var form = document.getElementById("booking-form");
    var date = form.elements["date"].value;
    var time = form.elements["time"].value;
    var professionalId = form.dataset.professionalId;

    // Crea un oggetto con i dati del form
    var data = {
        date: date,
        time: time,
        professionalId: professionalId
    };

    console.log(data);

    // Effettua la richiesta POST al server
    fetch("/api/prenota", {
        method: "POST",
        headers: {
        "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    .then(function(response) {
        if (response.ok) {
        // La prenotazione è stata effettuata con successo
        alert("Prenotazione effettuata con successo!");
        // Esegui altre azioni o reindirizza l'utente a una pagina di conferma
        } else {
        // La prenotazione non è stata effettuata
        alert("Errore durante la prenotazione. Riprova più tardi.");
        }
    })
    .catch(function(error) {
        console.error("Errore durante la richiesta:", error);
    });
});
