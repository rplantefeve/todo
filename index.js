// utilisation d'express
var express = require('express');
// instanciation de l'application
var app = express();
/*
 création du serveur HTTP. Pourrait s'ecrire aussi :
 var http = require('http').Server(app);
 */
var http = require('http').createServer(app);
/*
 Chargement de socket.io. Equivalent à :
 var io = require('socket.io').listen(server);
*/
var io = require('socket.io')(http);
// pour gérer les chemins d'accès
var path = require('path');
// pour gérer la session express
var session = require('express-session');
// pour gérer l'envoi du formulaire
var parser = require('body-parser');

// création du parser de la requête
var urlencodedParser = parser.urlencoded({
  extended: false
})

// emplacement des fichiers statiques (images, ...)
var dir = path.join(__dirname, 'public');

// date d'expiration du cookie de session : 1 heure
var expiryDate = new Date(Date.now() + 60 * 60 * 1000);

// variable de session du serveur express
var sessionMiddleware = session({
  /*
    store: new RedisStore({}),
    secret: 'Bob Morane',
    resave: false,
    saveUninitialized: true
    */
  name: 'session',
  secret: 'Bob Morane',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false,
    expires: expiryDate
  }
});

// init du middleware pour servir des fichiers
app.use(express.static(dir))
  // utilisation du middleware de session
  .use(sessionMiddleware)
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

  // ajout d'une route de suppression
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

io.use(function(socket, next) {
  sessionMiddleware(socket.request, socket.request.res || {}, next);
});

// Quand un client se connecte, on envoi un message au client
io.on('connection', function(socket) {
  var tmp = socket.request.session;
  // Quand un client se connecte, on le note dans la console
  console.log('Un bosseur est connecté !');

  //si un client se déconnecte
  socket.on('disconnect', function() {
    console.log('Un bosseur s\'est déconnecté !');
  })

  // ajout d'une tâche
  socket.on('task_added', function(task) {
    // on le log
    console.log('Tâche pour ajout ' + task);
    // sinon, on l'ajoute
    socket.request.session.thingsToDo.push(task);
    // on le log
    console.log('Tâche ajoutée ' + task);
    /*
     envoi d'un message à tous les autres clients, pour mettre à jour leur
     liste de tâches
     */
    socket.broadcast.emit('task_to_add', { task:task, num: socket.request.session.thingsToDo.length - 1 });
  });

  // suppression d'une tâche
  socket.on('task_deleted', function(idtask) {
    // on le log
    console.log('Tâche pour être supprimée : ' + idtask);
    /*
     envoi d'un message à tous les autres clients, pour mettre à jour leur
     liste de tâches
     */
    socket.broadcast.emit('task_to_delete',  idtask);
    // on le log
    console.log('Tâche supprimée : ' + idtask);
  });

});

// app.listen ne fonctionnerait pas
http.listen(8080, function() {
  console.log('Ecoute sur : *:8080');
});
