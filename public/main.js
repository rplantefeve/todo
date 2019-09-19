/*
le socket se connecte par défaut à l'instanciation
si ce n'est pas le cas, on peut faire :
var socket = io.connect()
*/
var socket = io('http://localhost:8080');

// on écoute l'arrivée de message du serveur
socket.on('task_to_add', function(task) {
  // manipulation du DOM avec jQuery
  $('#tasks').append('<li>' + task.task + '<a id="del_' + task.num + '" href="delete/' +
    task.num +
    '"><img src="delete-1-icon.png" alt="" width="10" height="10"></a></li>');
});
// on écoute l'arrivée de message du serveur
socket.on('task_to_delete', function(id) {
  var idNum = parseInt(id) + 1;
  // alert('tache à supprimer : ' + idNum);
  var queryString = '#tasks :nth-child(' + idNum + ')';
  // manipulation du DOM avec jQuery
  $(queryString).remove();
});

// Ajout : envoi d'un message au serveur par submit du formulaire
$('form').submit(function(e) {
  //e.preventDefault();
  // manip du DOM
  var task = $('#task').val();
  // envoi de la tâche au serveur
  socket.emit('task_added', task);
  //return false;
});

// Suppression
$('#tasks').on('click','li a', function() {
  // récup de l'id dans l'url du lien
  var ids = this.href.split('/');
  var id = ids[ids.length - 1];
  //alert(id);
  // envoi de la tâche à supprimer au serveur
  socket.emit('task_deleted', id);

});
