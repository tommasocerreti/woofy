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
