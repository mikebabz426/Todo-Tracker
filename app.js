const displaySection = document.getElementById("todos-display");
const inputText = document.getElementById("input");
const addTodoBtn = document.getElementById("add-todo");
const toggleAllBtn = document.getElementById("toggle-all");

var todos = [];

//Event Listeners
toggleAllBtn.addEventListener("click", toggleAll);
addTodoBtn.addEventListener("click", addTodos);
displaySection.addEventListener("click", deleteTodo);
displaySection.addEventListener("click", toggleCompleted);
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
displaySection.addEventListener("click", function (e) {
	if (e.target.className === "branch-button") {
		createBranch(e);
	}
});

//Add Todos:

function addTodos(e) {
	e.preventDefault();
	var todoText = inputText.value;
	var id = todos.length;

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
	var item = e.target;

	if (item.classList[0] === "delete-button") {
		var parent = item.parentElement;
		var index = parent.id - 1;
		todos.splice(index, 1);
		parent.remove();
	}
}

//Toggle Todo as Completed

function toggleCompleted(e) {
	var item = e.target;
	var parent = item.parentElement;

	if (item.classList[0] === "toggle") {
		var index = parent.id - 1;
		parent.classList.add("completed");
		todos[index].completed = true;
	}
}

function toggleAll(e) {
	e.preventDefault();
	var counter = 0;
	todos.forEach(function (todo) {
		if (todo.completed === true) {
			counter++;
		}
	});

	todos.forEach(function (todo) {
		if (counter === todos.length) {
			todo.completed = false;
			var id = (todo.id + 1).toFixed();
			var divItem = document.getElementById(id);
			divItem.classList.remove("completed");
		} else if (todo.completed === false) {
			todo.completed = true;
			var id = (todo.id + 1).toFixed();
			var divItem = document.getElementById(id);
			divItem.classList.add("completed");
		}
	});
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

function createBranch(e) {
	e.preventDefault();
}

//Display Todos to the screen

function displayTodos() {
	var branchBtn = document.createElement("button");
	var todoText = inputText.value;
	var todoLi = document.createElement("li");
	var todoItem = document.createElement("div");
	var deleteBtn = document.createElement("button");
	var checkBtn = document.createElement("button");
	var editInput = document.createElement("input");

	editInput.classList.add("hidden");
	editInput.classList.add("edit-input");

	branchBtn.innerHTML = '<i class="fas fa-code-branch"></i>';
	branchBtn.classList.add("branch-button");

	deleteBtn.innerHTML = '<i class="fas fa-minus-circle"></i>';
	deleteBtn.classList.add("delete-button");

	checkBtn.innerHTML = '<i class="far fa-check-circle"></i>';
	checkBtn.classList.add("toggle");

	todoLi.innerHTML = todoText;
	todoLi.classList.add("item-li");

	todoItem.classList.add("item");
	todoItem.id = todos.length;

	todoItem.appendChild(branchBtn);
	todoItem.appendChild(editInput);
	todoItem.appendChild(todoLi);
	todoItem.appendChild(deleteBtn);
	todoItem.appendChild(checkBtn);
	displaySection.appendChild(todoItem);
	inputText.value = "";
}
