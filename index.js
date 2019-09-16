var express = require('express');
// pour gérer les chemins d'accès
var path = require('path');
// pour gérer la session
var session = require('express-session');
// pour gérer l'envoi du formulaire
var parser = require('body-parser');

// instanciation de l'application
var app = express();

// création du parser de la requête
var urlencodedParser = parser.urlencoded({
  extended: false
})

// emplacement des fichiers statiques (images, ...)
var dir = path.join(__dirname, 'public');

// date d'expiration du cookie de session : 1 heure
var expiryDate = new Date(Date.now() + 60 * 60 * 1000);



app.use(express.static(dir)) // init du middleware pour servir des fichiers

  .use(session({
    name: 'session',
    secret: 'Bob Morane',
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false,
      expires: expiryDate
    }
  }))
  // ajout d'un middleware perso pour initialiser le tableau de tâches
  .use(function(req, res, next) {
    // Gestion du tableau de tâches
    if (!req.session.thingsToDo) {
      // Initialisation en dur
      req.session.thingsToDo = ['Couper du bois', 'Faire la vaisselle', 'Nourrir le cheval'];
    }
    next();
  })

  // ajout d'une route GET (route par défaut)
  .get('/', function(req, res, next) {
    res.render('accueil.ejs', {
      thingsToDo: req.session.thingsToDo
    })
  })

  // ajout d'une route GET (route par défaut)
  .get('/delete/:id', function(req, res, next) {
    // Suppression de la tâche i du tableau de tâches
    req.session.thingsToDo.splice(req.params.id, 1);
    // redirection vers l'accueil
    res.redirect('/');
  })
  // Ajout de la route POST /add pur ajouter une tâche
  .post('/add', urlencodedParser, function(req, res) {
    let thingsToDo = req.session.thingsToDo;
    let task = req.body.task;
    // si la variable de session existe
    if (thingsToDo) {
      // et que la variable du formulaire task existe également
      if (task) {
        // ajout de la tâche au tableau
        thingsToDo.push(task);
      }
    }
    // redirection vers l'accueil
    res.redirect('/');
  })

  // gestion des routes inconnues
  .use(function(req, res, next) {
    // redirection vers l'accueil
    res.redirect('/');
  });

app.listen(8080);
