var express = require('express');

// instanciation de l'application
var app = express();

// ajout d'une route GET (route par défaut)
app.get('/', function(req, res) {
    res.render('accueil.ejs');
  })

  // gestion des routes inconnues
  .use(function(req, res, next) {
    res.setHeader('Content-Type', 'text/plain');
    res.status(404).send('Page introuvable !');
  });

app.listen(8080);
