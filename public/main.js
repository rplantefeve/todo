/*
le socket se connecte par défaut à l'instanciation
si ce n'est pas le cas, on peut faire :
var socket = io.connect()
*/
var socket = io('http://localhost:8080');

// on écoute l'arrivée de message du serveur
socket.on('task_to_add', function(task) {
  // manipulation du DOM avec jQuery
  $('#tasks').append('<li>' + task.task + '<form class="deleteForm" action="#" ' +
    'method="get"><input type="image" src="delete-1-icon.png" class="delete" ' +
    'alt="delete task" width="10" height="10"></form></li>');
});
// on écoute l'arrivée de message du serveur
socket.on('task_to_delete', function(id) {
  // manipulation du DOM avec jQuery
  var elem = $("#tasks li").eq(id);
  // suppression
  elem.remove();
});

// Ajout
$('#formAdd').submit(function(e) {
  var task = $('#task').val();
  // envoi de la tâche au serveur
  socket.emit('task_added', task);
  //return false;
});

/*
 Suppression (évènement delegate sur la balise parente. Ainsi, les balises
  enfants auront tous le même listener)
 */
$('#tasks').on('click', 'li .delete', function() {
  // je récupère l'élément parent du <input> (<form>)
  var form = $(this).parent();
  // je récupère l'élément parent du <form> (<li>)
  var li = form.parent();
  // j'obtiens la place de cette <li> dans la liste <ul>
  var index = li.index();
  // je change dynamiquement la route du form
  form.attr('action', '/delete/' + index);
  // j'ajoute une donnée bien pratique
  form.attr('data-index', index);
  // envoi de la tâche à supprimer au serveur
  socket.emit('task_deleted', index);
});
