var express = require('express');
// pour gérer la session
var session = require('express-session');

// instanciation de l'application
var app = express();

// date d'expiration du cookie de session : 1 heure
var expiryDate = new Date(Date.now() + 60 * 60 * 1000);

// tableau de test de choses à faire
var thingsToDo = ['Couper du bois', 'Faire la vaisselle', 'Nourrir le cheval'];

// Accepter les connexions sécurisées du localhost
app.use(session({
    name: 'session',
    secret: 'Bob Morane',
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false,
      expires: expiryDate
    }
  }))

  // ajout d'une route GET (route par défaut)
  .get('/', function(req, res, next) {
    if (req.session.views) {
      req.session.views++;
    } else {
      req.session.views = 1;
    }

    // Gestion du tableau de tâches
    if (!req.session.thingsToDo) {
      req.session.thingsToDo = thingsToDo;
    }

    res.render('accueil.ejs', {
      views: req.session.views,
      thingsToDo : req.session.thingsToDo
    });
  })

  // gestion des routes inconnues
  .use(function(req, res, next) {
    res.setHeader('Content-Type', 'text/plain');
    res.status(404).send('Page introuvable !');
  });

app.listen(8080);
