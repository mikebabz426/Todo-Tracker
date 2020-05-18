const displaySection = document.getElementById("todos-display");
const inputText = document.getElementById("input");
const addTodoBtn = document.getElementById("add-todo");
const toggleAllBtn = document.getElementById("toggle-all");

var todos = [];
var idCounter = 0;

//Returns the index of the item which was clicked or the array that contains it
function getIndex(el, array) {
	var id = el.parentElement.getAttribute("id");
	var i = array.length;

	while (i--) {
		//Recursive Case:  if element is an array, recurse
		if (Array.isArray(array[i])) {
			if (getIndex(el, array[i]) !== undefined) {
				return i;
			}
			//Base Case:  if element is not an array, check ID against element's id for match
		} else if (array[i].id === id) {
			return i;
		}
	}
}
//Creates Unique ID for each Todo Item
function uniqueId() {
	return "id-" + idCounter++;
}

//Event Listeners
toggleAllBtn.addEventListener("click", function (e) {
	if (e.target.id === "toggle-all") {
		toggleAll(e, todos);
	}
});
addTodoBtn.addEventListener("click", addTodos);
displaySection.addEventListener("click", function (e) {
	if (e.target.classList[0] === "delete-button") {
		deleteTodo(e, todos);
	}
});
displaySection.addEventListener("click", function (e) {
	if (e.target.classList[0] === "toggle") {
		toggleCompleted(e, todos);
	}
});
displaySection.addEventListener("click", function (e) {
	if (e.target.className === "item-li") {
		editTodo(e);
	}
});
displaySection.addEventListener("focusout", function (e) {
	e.preventDefault();
	//Updates the DOM if changes are made to an existing todo
	if (e.target.className === "edit-input") {
		var div = e.target.parentElement;

		var todoLi = div.childNodes[2];
		todoLi.textContent = e.target.value;
		todoLi.classList.remove("hidden");
		e.target.classList.add("hidden");

		updateTodo(e, todos);
	}
});
displaySection.addEventListener("keyup", function (e) {
	if (event.which == 13 || event.keyCode == 13) {
		e.target.blur();
	}
});
displaySection.addEventListener("click", function (e) {
	if (e.target.className === "branch-button") {
		createBranch(e, todos);
	}
});

//Updates the todos Array if a change is made to an existing todo

function updateTodo(e, array) {
	array.forEach(function (todo, i, array) {
		if (Array.isArray(array[i])) {
			updateTodo(e, array[i]);
		} else {
			if (e.target.parentElement.id === todo.id) {
				todo.name = e.target.value;
			}
		}
	});
}

//Adds Todos:

function addTodos(e) {
	e.preventDefault();

	var todoText = inputText.value;
	var id = uniqueId();

	todos.push({
		name: todoText,
		completed: false,
		id: id,
	});
	displaySection.innerHTML = "";
	displayTodos(todos);
}

//Deletes Todos

function deleteTodo(e, array) {
	e.preventDefault();

	array.forEach(function (todo, i, array) {
		if (Array.isArray(array[i])) {
			if (array[i].length === 0) {
				array.splice(i, 1);
			} else {
				deleteTodo(e, array[i]);
			}
		} else if (array[i].id === e.target.parentElement.id) {
			array.splice(i, 1);
		}
	});
	displaySection.innerHTML = "";
	displayTodos(todos);
}

//Toggles Todo Completion property

function toggleCompleted(e, array) {
	array.forEach(function (todo, i, array) {
		if (Array.isArray(array[i])) {
			toggleCompleted(e, array[i]);
		} else if (array[i].id === e.target.parentElement.id) {
			todo.completed = !todo.completed;
		}
	});
	displaySection.innerHTML = "";
	displayTodos(todos);
}

// Toggles Completion Property for All Todos

function toggleAll(e, array) {
	e.preventDefault();
	var completeCounter = 0;
	var incompleteCounter = 0;

	array.forEach(function (todo, i, array) {
		if (Array.isArray(array[i])) {
			toggleAll(e, array[i]);
		} else {
			if (todo.completed === false) {
				incompleteCounter++;
			} else if (todo.completed === true) {
				completeCounter++;
			}
		}
	});

	array.forEach(function (todo, i, array) {
		if (incompleteCounter > 0 && completeCounter === 0) {
			todo.completed = true;
		} else if (incompleteCounter === 0 && completeCounter > 0) {
			todo.completed = false;
		} else {
			todo.completed = true;
		}
	});

	displaySection.innerHTML = "";
	displayTodos(todos);
}

//Edits a Todo

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
//Creates a nested Todo
function createBranch(e, array) {
	var inx = getIndex(e.target, array);
	for (var i = 0; i < array.length; i++) {
		var parentId = e.target.parentElement.id;
		var todoText = "Click to add todo";

		if (array[i] === array[inx] && Array.isArray(array[i])) {
			var parentArr = array[i];
			//Base Case 2:
			if (parentArr[0].id === parentId) {
				parentArr.push({
					name: todoText,
					completed: false,
					id: uniqueId(),
				});
				break;
			} else {
				//Recursion
				createBranch(e, array[i]);
			}
		} else if (array[i] === array[inx]) {
			//BASE CASE - is parent element but not an array

			array[i] = [array[i]];
			array[i].push({
				name: todoText,
				completed: false,
				id: uniqueId(),
			});
			break;
		}
	}

	displaySection.innerHTML = "";
	displayTodos(todos);
}

//Displays Todos to the screen

function displayTodos(array, counter = 0) {
	var counter = counter;

	array.forEach(function (todo, i, arr) {
		//RECURSIVE CASE
		if (Array.isArray(arr[i])) {
			displayTodos(arr[i], (counter += 1));
			counter--;
		} else {
			//BASE CASE
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

			if (todoItem.id) todoLi.innerHTML = todoText;
			todoItem.appendChild(branchBtn);
			todoItem.appendChild(editInput);
			todoItem.appendChild(todoLi);
			todoItem.appendChild(deleteBtn);
			todoItem.appendChild(checkBtn);
			displaySection.appendChild(todoItem);

			var styleClass = "px-" + counter;

			if (counter > 0) {
				if (arr[i] === arr[0]) {
					todoItem.classList.add("px-" + (counter - 1));
				} else {
					todoItem.classList.add(styleClass);
				}
			} else {
				todoItem.classList.add(styleClass);
			}

			inputText.value = "";
		}
	});
}
