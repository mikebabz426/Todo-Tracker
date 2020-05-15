const displaySection = document.getElementById("todos-display");
const inputText = document.getElementById("input");
const addTodoBtn = document.getElementById("add-todo");
const toggleAllBtn = document.getElementById("toggle-all");

var todos = [];

//Event Listeners
toggleAllBtn.addEventListener("click", function (e) {
	if (e.target.id === "toggle-all") {
		toggleAll(e);
	}
});
addTodoBtn.addEventListener("click", addTodos);
displaySection.addEventListener("click", function (e) {
	if (e.target.classList[0] === "delete-button") {
		deleteTodo(e);
	}
});
displaySection.addEventListener("click", function (e) {
	if (e.target.classList[0] === "toggle") {
		toggleCompleted(e);
	}
});
displaySection.addEventListener("click", function (e) {
	if (e.target.className === "item-li") {
		editTodo(e);
	}
});
displaySection.addEventListener("focusout", function (e) {
	e.preventDefault();
	if (e.target.className === "edit-input") {
		var div = e.target.parentElement;

		var todoLi = div.childNodes[2];
		todoLi.textContent = e.target.value;
		todoLi.classList.remove("hidden");
		e.target.classList.add("hidden");
	}
});
displaySection.addEventListener("keyup", function (e) {
	if (event.which == 13 || event.keyCode == 13) {
		e.target.blur();
	}
});
displaySection.addEventListener("click", function (e) {
	if (e.target.className === "branch-button") {
		createBranch(e);
	}
});

//Add Todos:

function addTodos(e) {
	e.preventDefault();
	var todoText = inputText.value;
	var id = todos.length + "";

	todos.push({
		name: todoText,
		completed: false,
		id: id,
	});

	displayTodos();
}

//Delete Todos

function deleteTodo(e) {
	e.preventDefault();

	todos.forEach(function (todo, i, todos) {
		if (todos[i].id === e.target.parentElement.id) {
			todos.splice(i, 1);
		}
	});

	displayTodos();
}

//Toggle Todo as Completed

function toggleCompleted(e) {
	// debugger;
	todos.forEach(function (todo, i, todos) {
		if (todos[i].id === e.target.parentElement.id) {
			todo.completed = !todo.completed;
		}
	});
	displayTodos();
}

// Toggle All

function toggleAll(e) {
	// debugger;
	e.preventDefault();
	var counter = 0;
	todos.forEach(function (todo) {
		if (todo.completed === true) {
			counter++;
		}
	});
	if (counter === todos.length) {
		todos.forEach(function (todo) {
			todo.completed = false;
		});
	} else {
		todos.forEach(function (todo) {
			todo.completed = true;
		});
	}

	displayTodos();
}

function editTodo(e) {
	e.preventDefault();
	var itemId = e.target.parentElement.id;
	var itemDiv = document.getElementById(itemId);
	var inputField = itemDiv.childNodes[1];

	itemDiv.childNodes[1].classList.remove("hidden");
	itemDiv.childNodes[2].classList.add("hidden");
	inputField.value = itemDiv.childNodes[2].innerHTML;
	inputField.focus();
}

function createBranch(e) {}

//Display Todos to the screen

function displayTodos() {
	displaySection.innerHTML = "";

	todos.forEach(function (todo) {
		var branchBtn = document.createElement("button");
		var todoLi = document.createElement("li");
		var todoItem = document.createElement("div");
		var deleteBtn = document.createElement("button");
		var checkBtn = document.createElement("button");
		var editInput = document.createElement("input");
		var todoText = todo.name;
		branchBtn.innerHTML = '<i class="fas fa-code-branch"></i>';
		branchBtn.classList.add("branch-button");

		editInput.classList.add("hidden");
		editInput.classList.add("edit-input");

		deleteBtn.innerHTML = '<i class="fas fa-minus-circle"></i>';
		deleteBtn.classList.add("delete-button");

		checkBtn.innerHTML = '<i class="far fa-check-circle"></i>';
		checkBtn.classList.add("toggle");

		todoLi.classList.add("item-li");
		todoItem.classList.add("item");

		if (todo.completed === true) {
			todoItem.classList.add("completed");
		}

		todoItem.id = todo.id;
		todoLi.innerHTML = todoText;
		todoItem.appendChild(branchBtn);
		todoItem.appendChild(editInput);
		todoItem.appendChild(todoLi);
		todoItem.appendChild(deleteBtn);
		todoItem.appendChild(checkBtn);
		displaySection.appendChild(todoItem);

		inputText.value = "";
	});
}
