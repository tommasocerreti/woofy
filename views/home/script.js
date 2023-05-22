document.addEventListener('DOMContentLoaded', function() {
    $(function() {
      $('.my-button').on('click', function() {
        const professione = $(this).data('professione');
        window.location.href = 'prenota?profession=' + professione;
      });
    });
});