document.addEventListener('DOMContentLoaded', function () {
  var addInput = document.getElementById('add_new');
  var addButton = document.getElementById('add_btn');
  var todoList = document.getElementById('todo_list');

  addButton.addEventListener('click', function () {
    var todoText = addInput.value.trim();
    if (todoText !== '') {
      addTodo(todoText);
      addInput.value = '';
    }
  });

  todoList.addEventListener('click', function (event) {
    var targetElement = event.target;
    if (targetElement.type === 'checkbox') {
      var todoId = targetElement.closest('li').id;
      var completed = targetElement.checked;
      toggleComplete(todoId, completed);
    }
    if (targetElement.classList.contains('delete_btn')) {
      var todoId = targetElement.closest('li').id;
      deleteTodo(todoId);
    }
  });

  todoList.addEventListener('keyup', function (event) {
    var targetElement = event.target;
    if (
      event.key === 'Enter' &&
      targetElement.classList.contains('edit_input')
    ) {
      var todoId = targetElement.closest('li').id;
      var newText = targetElement.value.trim();
      updateTodoText(todoId, newText);
    }
  });

  function addTodo(todoText) {
    var data = { text: todoText };
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 201) {
        var todo = JSON.parse(this.responseText);
        displayTodo(todo);
      }
    };
    xhttp.open('POST', '/todos', true);
    xhttp.setRequestHeader('Content-type', 'application/json');
    xhttp.send(JSON.stringify(data));
  }

  function displayTodo(todo) {
    var todoItem = createTodoElement(todo);
    todoList.appendChild(todoItem);
  }

  function toggleComplete(todoId, completed) {
    var data = { completed: completed };
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        updateTodoStyle(todoId, completed);
      }
    };
    xhttp.open('PUT', '/todos/' + todoId, true);
    xhttp.setRequestHeader('Content-type', 'application/json');
    xhttp.send(JSON.stringify(data));
  }

  function updateTodoText(todoId, newText) {
    var data = { text: newText };
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        updateTodoStyle(todoId, newText);
      }
    };
    xhttp.open('PUT', '/todos/' + todoId, true);
    xhttp.setRequestHeader('Content-type', 'application/json');
    xhttp.send(JSON.stringify(data));
  }

  function updateTodoStyle(todoId, updatedValue) {
    var todoElement = document.getElementById(todoId);
    if (todoElement) {
      var textInput = todoElement.querySelector('.edit_input');
      textInput.value = updatedValue;
    }
  }

  function deleteTodo(todoId) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        var todoElement = document.getElementById(todoId);
        if (todoElement) {
          todoList.removeChild(todoElement);
        }
      }
    };
    xhttp.open('DELETE', '/todos/' + todoId, true);
    xhttp.send();
  }

  function createTodoElement(todo) {
    var todoItem = document.createElement('li');
    todoItem.id = todo._id;

    var checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'complete_checkbox';
    checkbox.checked = todo.completed;

    var label = document.createElement('label');
    label.htmlFor = 'checkbox_' + todo._id;

    var textInput = document.createElement('input');
    textInput.type = 'text';
    textInput.value = todo.text;
    textInput.className = 'edit_input';

    var deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete_btn';
    deleteBtn.textContent = 'Delete';

    todoItem.appendChild(checkbox);
    todoItem.appendChild(textInput);
    todoItem.appendChild(deleteBtn);

    if (todo.completed) {
      todoItem.classList.add('completed');
    }

    return todoItem;
  }

  function loadTodos() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        var todos = JSON.parse(this.responseText);
        todos.forEach(displayTodo);
      }
    };
    xhttp.open('GET', '/todos', true);
    xhttp.send();
  }
  loadTodos();
});
