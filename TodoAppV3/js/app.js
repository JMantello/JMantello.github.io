window.addEventListener("load", () => {
  todoMain();
  console.log("The app loaded successfully.");
});

function todoMain() {
  // List
  let todoList = [];

  // Elements
  let taskInput, dateDueInput, categoryInput, addTodoBtn;
  let categorySelectionElem, completedSelectionElem;

  // Filters

  getElements();

  addListeners();

  loadTodoList();

  renderToHTML();

  function getElements() {
    taskInput = document.getElementById("task-input");
    dateDueInput = document.getElementById("due-date-input");
    categoryInput = document.getElementById("category-input");
    addTodoBtn = document.getElementById("add-todo-btn");

    categorySelectionElem = document.getElementById("category-sort-selection");
    completedSelectionElem = document.getElementById(
      "completed-sort-selection"
    );
  }

  function addListeners() {
    addTodoBtn.addEventListener("click", addTodo, false);
    categorySelectionElem.addEventListener("change", renderToHTML, false);
    completedSelectionElem.addEventListener("change", renderToHTML, false);
  }

  function addTodo() {
    let todo = {
      id: generateUUID(),
      dateAdded: new Date().toUTCString(),
      task: taskInput.value,
      category: categoryInput.value,
      dateDue: dateDueInput.value,
      completed: false,
    };

    todoList.push(todo);

    saveTodoList();

    renderToHTML();

    taskInput.value = "";
    categoryInput.value = "";
    dateDueInput.value = "";
  }

  function generateUUID() {
    var d = Date.now();
    if (
      typeof performance !== "undefined" &&
      typeof performance.now === "function"
    ) {
      d += performance.now(); //use high-precision timer if available
    }
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
      }
    );
  }

  function saveTodoList() {
    localStorage.setItem("todoList", JSON.stringify(todoList));
  }

  function loadTodoList() {
    let savedData = localStorage.getItem("todoList");
    if (savedData == null) {
      saveTodoList();
      console.log("No saved data found. New todoList created.");
    } else {
      todoList = JSON.parse(savedData);
      console.log("Saved data loaded successfully.");
    }
  }

  function renderToHTML() {
    clearRows();

    populateCategoryOptions();

    let filters = {
      category: categorySelectionElem.value,
      completed: completedSelectionElem.value,
    };

    let filteredTodos = getFilteredTodos(filters);

    filteredTodos.forEach((todo) => {
      renderRow(todo);
    });
  }

  function populateCategoryOptions() {
    let optionsSet = getCategoryOptionsSet();
    let selectedCategory = categorySelectionElem.value;

    // Note: populate category-list as well
    populateCategoryInputOptions(optionsSet);

    // Remove options
    let optionsToRemove = categorySelectionElem.options.length;
    for (let i = 1; i < optionsToRemove; i++) {
      categorySelectionElem.options[1].remove();
    }

    // Populate options
    for (let option of optionsSet) {
      categorySelectionElem.appendChild(createCategoryOption(option));
    }

    function createCategoryOption(optionName) {
      let newOption = document.createElement("option");
      newOption.value = optionName;
      newOption.innerText = optionName;
      if (optionName == selectedCategory) {
        newOption.selected = true;
      }
      return newOption;
    }
  }

  function populateCategoryInputOptions(optionsSet) {
    let categoryInputList = document.getElementById("category-input-list");
    let optionsToRemove = categoryInputList.options.length;
    let selectedCategory = categoryInputList.value;

    for (let i = 0; i < optionsToRemove; i++) {
      categoryInputList.options[0].remove();
    }

    // Populate options
    for (let option of optionsSet) {
      categoryInputList.appendChild(createCategoryOption(option));
    }

    function createCategoryOption(optionName) {
      let newOption = document.createElement("option");
      newOption.value = optionName;
      newOption.innerText = optionName;
      if (optionName == selectedCategory) {
        newOption.selected = true;
      }
      return newOption;
    }
  }

  function getCategoryOptionsSet() {
    let options = [];

    todoList.forEach((todo) => {
      options.push(todo.category);
    });

    return new Set(options);
  }

  function getFilteredTodos(filters) {
    let selectedCategory = filters.category;
    let selectedCompleted = filters.completed;

    let filteredTodos = [];

    let filteredCategory = [];
    if (selectedCategory == "default-category-option") {
      filteredCategory = todoList;
    } else {
      filteredCategory = todoList.filter(
        (todo) => todo.category == selectedCategory
      );
    }

    filteredTodos = filteredCategory;

    let filteredCompleted = [];
    if (selectedCompleted == "Completed: Hide") {
      filteredCompleted = filteredTodos.filter(
        (todo) => todo.completed == false
      );
    } else {
      filteredCompleted = filteredTodos;
    }

    filteredTodos = filteredCompleted;

    return filteredTodos;
  }

  function clearRows() {
    let todoRows = Array.from(document.getElementsByClassName("todo-row"));
    todoRows.forEach((row) => {
      row.remove();
    });
  }

  function renderRow(todo) {
    let newRow = document.createElement("tr");
    newRow.classList.add("todo-row");
    newRow.dataset.id = todo.id;

    // Create Cells
    let dateAddedCell = document.createElement("td");
    let dateDueCell = document.createElement("td");
    let categoryCell = document.createElement("td");
    let taskCell = document.createElement("td");
    let completedCell = document.createElement("td");
    let deleteCell = document.createElement("td");

    // Date Added:
    let dateAddedSpan = document.createElement("span");
    dateAddedSpan.classList.add("date-added-span");
    let dateAddedObj = new Date(todo.dateAdded);
    dateAddedSpan.innerText = dateAddedObj.toLocaleDateString();

    // Date Due :
    let dateDueSpan = document.createElement("span");
    dateDueSpan.classList.add("date-due-span");
    if (todo.dateDue == "") dateDueSpan.innerText = todo.dateDue;
    else {
      // Format date from input
      let year = todo.dateDue.substring(0, 4);
      let month = todo.dateDue.substring(5, 7);
      let day = todo.dateDue.substring(8, 10);
      if (month[0] == "0") month = month.substring(1, 2);
      if (day[0] == "0") day = day.substring(1, 2);
      dateDueSpan.innerText = month + "/" + day + "/" + year;
    }

    // Category:
    let categorySpan = document.createElement("span");
    dateAddedSpan.classList.add("category-span");
    categorySpan.innerText = todo.category;

    // To-Do Task:
    let taskSpan = document.createElement("span");
    dateAddedSpan.classList.add("task-span");
    taskSpan.innerText = todo.task;

    // Completed:
    let completedSpan = document.createElement("span");
    let completedCheckbox = document.createElement("input");
    completedCheckbox.type = "checkbox";
    completedCheckbox.classList.add("completed-checkbox");
    completedCheckbox.checked = todo.completed;
    completedCheckbox.addEventListener("click", toggleCompleted, false);
    completedSpan.appendChild(completedCheckbox);

    // Delete:
    let deleteSpan = document.createElement("span");
    deleteSpan.innerHTML = "close";
    deleteSpan.classList.add("material-icons");
    deleteSpan.classList.add("delete-todo-btn");
    deleteSpan.addEventListener("click", promptDeleteMessage, false);

    // Add elements to cells
    dateAddedCell.appendChild(dateAddedSpan);
    dateDueCell.appendChild(dateDueSpan);
    categoryCell.appendChild(categorySpan);
    taskCell.appendChild(taskSpan);
    completedCell.appendChild(completedSpan);
    deleteCell.appendChild(deleteSpan);

    // Add cells to row
    newRow.appendChild(dateAddedCell);
    newRow.appendChild(taskCell);
    newRow.appendChild(categoryCell);
    newRow.appendChild(dateDueCell);
    newRow.appendChild(completedCell);
    newRow.appendChild(deleteCell);

    // Add new row to table
    document.getElementById("todo-table").appendChild(newRow);

    // Row Functions
    function toggleCompleted() {
      for (let i = 0; i < todoList.length; i++) {
        if (todoList[i].id == todo.id) {
          todoList[i].completed = completedCheckbox.checked;
          saveTodoList();
        }
      }
    }

    function promptDeleteMessage() {
      if (confirm("Delete?")) {
        deleteTodo();
      }
    }

    function deleteTodo() {
      for (let i = 0; i < todoList.length; i++) {
        if (todoList[i].id == todo.id) {
          todoList.splice(i, 1);
          saveTodoList();
          renderToHTML(todoList);
        }
      }
    }
  }
}
