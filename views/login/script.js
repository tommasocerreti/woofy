// RIDIMENSIONAMENTO
function setBodyScale() {
  const viewportWidth = window.innerWidth;
  const scale = Math.min(viewportWidth / 1000, 1);
  document.body.style.transform = `scale(${scale})`;
}

window.addEventListener('resize', setBodyScale);
setBodyScale();
