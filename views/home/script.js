document.addEventListener('DOMContentLoaded', function() {
  $(function() {
    $('.my-button').on('click', function() {
      const professione = $(this).data('professione');
      inviaRichiestaPOST(professione);
    });
  });

  function inviaRichiestaPOST(professione) {
    $('<form action="/prenota" method="post">' +
      '<input type="hidden" name="profession" value="' + professione + '">' +
      '</form>').appendTo('body').submit();
  }
});
