const express = require('express');
const app = express();

app.use(express.static('public/index'));

app.listen(3000, function () {
  console.log('Server in ascolto sulla porta 3000!');
});
