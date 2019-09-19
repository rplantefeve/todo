/*
le socket se connecte par défaut à l'instanciation
si ce n'est pas le cas, on peut faire :
var socket = io.connect()
*/
var socket = io('http://localhost:8080');

// on écoute l'arrivée de message du serveur
socket.on('task_to_add', function(task) {
  // manipulation du DOM avec jQuery
  $('#tasks').append('<li>' + task.task + '<a class="delete" href="delete/' +
    task.num + '" data-index="'+ task.num
    + '"><img src="delete-1-icon.png" alt="" width="10" height="10"></a></li>');
});
// on écoute l'arrivée de message du serveur
socket.on('task_to_delete', function(id) {
  var idNum = parseInt(id) + 1;
  // alert('tache à supprimer : ' + idNum);
  var queryString = '#tasks :nth-child(' + idNum + ')';
  //console.log(queryString);
  alert(queryString);
  // manipulation du DOM avec jQuery
  var elem = $(queryString);
  
  elem.remove();
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

/*
 Suppression (évènement delegate sur la balise parente. Ainsi, les balises
  enfants auront tous le même listener)
 */
$('#tasks').on('click','li .delete', function() {
  // envoi de la tâche à supprimer au serveur
  socket.emit('task_deleted', $(this).data('index'));

});
