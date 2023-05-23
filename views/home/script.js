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
