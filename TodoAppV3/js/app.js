window.addEventListener("load", () => {
  todoMain();
  console.log("The app loaded successfully.");
});

function todoMain() {
  let todoData = [];
  let inputState = [];

  let todoTable;

  // Input Elements
  let taskInputElem, dateDueInputElem, categoryInputElem, addTodoBtn;
  let sortDateAddedElem, sortCategoryElem, sortCompletedElem, sortDateDueElem;
  let showDateAddedCB,
    showCategoryCB,
    showTodoTaskCB,
    showDateDueCB,
    showCompletedCB,
    showDeleteCB;

  initApp();

  function initApp() {
    getElements();

    addListeners();

    loadTodoList();
  }

  function getElements() {
    taskInputElem = document.getElementById("task-input");
    dateDueInputElem = document.getElementById("due-date-input");
    categoryInputElem = document.getElementById("category-input");
    addTodoBtn = document.getElementById("add-todo-btn");

    sortDateAddedElem = document.getElementById("date-added-sort-selection");
    sortCategoryElem = document.getElementById("category-sort-selection");
    sortCompletedElem = document.getElementById("completed-sort-selection");
    sortDateDueElem = document.getElementById("due-date-sort-selection");

    showDateAddedCB = document.getElementById("filterDateAddedCB");
    showCategoryCB = document.getElementById("filterCategoryCB");
    showTodoTaskCB = document.getElementById("filterTodoTaskCB");
    showDateDueCB = document.getElementById("filterDateDueCB");
    showCompletedCB = document.getElementById("filterCompletedCB");
    showDeleteCB = document.getElementById("filterDeleteCB");

    todoTable = document.getElementById("todo-table");
  }

  function addListeners() {
    addTodoBtn.addEventListener("click", addTodo, false);
    sortDateAddedElem.addEventListener("change", handleChangedState, false);
    sortCategoryElem.addEventListener("change", renderHTML, false);
    sortCompletedElem.addEventListener("change", renderHTML, false);
    sortDateDueElem.addEventListener("change", renderHTML, false);
    showDateAddedCB.addEventListener("change", renderHTML, false);
    showCategoryCB.addEventListener("change", renderHTML, false);
    showTodoTaskCB.addEventListener("change", renderHTML, false);
    showDateDueCB.addEventListener("change", renderHTML, false);
    showCompletedCB.addEventListener("change", renderHTML, false);
    showDeleteCB.addEventListener("change", renderHTML, false);
  }

  function handleChangedState() {
    let functions = [recordState, renderHTML];
    functions.forEach((fn) => {
      fn();
    });
  }

  function recordState() {
    console.log("Recorded state successfully. ");
  }

  function addTodo() {
    let todo = {
      id: generateUUID(),
      dateAdded: new Date().toUTCString(),
      task: taskInputElem.value,
      category: categoryInputElem.value,
      dateDue: dateDueInputElem.value,
      completed: false,
    };

    todoData.push(todo);

    saveTodoList();

    renderHTML();

    taskInputElem.value = "";
    categoryInputElem.value = "";
    dateDueInputElem.value = "";
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
    localStorage.setItem("todoData", JSON.stringify(todoData));
  }

  function loadTodoList() {
    let savedData = localStorage.getItem("todoData");
    if (savedData == null) {
      saveTodoList();
      console.log("No saved data found, new saved data created.");
    } else {
      todoData = JSON.parse(savedData);
      console.log("Saved data loaded successfully.");
    }

    renderHTML();
  }

  function renderHTML() {
    let todoList = getSortedTodos(getFilteredTodos(todoData));
    renderTable(todoList);
    populateCategoryOptions();
  }

  function getFilteredTodos() {
    let selectedCategory = sortCategoryElem.value;
    let selectedCompleted = sortCompletedElem.value;

    let filteredTodos = [];

    let filteredCategory = [];
    if (selectedCategory == "default-category-option") {
      filteredCategory = todoData;
    } else {
      filteredCategory = todoData.filter(
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

  function getSortedTodos(todoList) {
    let sortedTodos = [...todoList];

    if (sortDateAddedElem.value == "Date Added: First") {
      sortedTodos.sort((todoA, todoB) => {
        let dateA = Date.parse(todoA.dateAdded);
        let dateB = Date.parse(todoB.dateAdded);
        return dateA - dateB;
      });
    }

    if (sortDateAddedElem.value == "Date Added: Last") {
      sortedTodos.sort((todoA, todoB) => {
        let dateA = Date.parse(todoA.dateAdded);
        let dateB = Date.parse(todoB.dateAdded);
        return dateB - dateA;
      });
    }

    // Under construction
    if (sortCompletedElem.value == "Completed: Top") {
      sortedTodos.sort((todoA, todoB) => {
        if (!todoA.completed && todoB.completed) return 1;
        else if (todoA.completed && !todoB.completed) return -1;
        else return 0;
      });
    }

    if (sortCompletedElem.value == "Completed: Bottom") {
      sortedTodos.sort((todoA, todoB) => {
        if (!todoA.completed && todoB.completed) return -1;
        else if (todoA.completed && !todoB.completed) return 1;
        else return 0;
      });
    }

    if (sortDateDueElem.value == "Date Due: First") {
      sortedTodos.sort((todoA, todoB) => {
        let dateA = Date.parse(todoA.dateDue);
        let dateB = Date.parse(todoB.dateDue);
        return dateA - dateB;
      });
    }

    if (sortDateDueElem.value == "Date Due: Last") {
      sortedTodos.sort((todoA, todoB) => {
        let dateA = Date.parse(todoA.dateDue);
        let dateB = Date.parse(todoB.dateDue);
        return dateB - dateA;
      });
    }

    return sortedTodos;
  }

  function renderTable(todoList) {
    clearTable();

    renderTableHead();

    todoList.forEach((todo) => {
      renderRow(todo);
    });

    hideColumns();
  }

  function clearTable() {
    todoTable.innerHTML = "";
  }

  function renderTableHead() {
    todoTable.innerHTML = "";

    let headerRow = document.createElement("tr");
    let dateAddedColumn = document.createElement("th");
    let taskColumn = document.createElement("th");
    let categoryColumn = document.createElement("th");
    let dateDueColumn = document.createElement("th");
    let completedColumn = document.createElement("th");
    let deleteColumn = document.createElement("th");

    dateAddedColumn.innerText = "Date Added";
    taskColumn.innerText = "To-Do Task";
    categoryColumn.innerText = "Category";
    dateDueColumn.innerText = "Date Due";
    completedColumn.innerText = "Completed";
    deleteColumn.innerText = "Delete";

    headerRow.id = "todo-table-header";
    dateAddedColumn.classList.add("column-date-added");
    taskColumn.classList.add("column-todo-task");
    categoryColumn.classList.add("column-category");
    dateDueColumn.classList.add("column-date-due");
    completedColumn.classList.add("column-completed");
    deleteColumn.classList.add("column-delete");

    headerRow.appendChild(dateAddedColumn);
    headerRow.appendChild(taskColumn);
    headerRow.appendChild(categoryColumn);
    headerRow.appendChild(dateDueColumn);
    headerRow.appendChild(completedColumn);
    headerRow.appendChild(deleteColumn);

    todoTable.appendChild(headerRow);
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

    dateAddedCell.classList.add("column-date-added");
    dateDueCell.classList.add("column-date-due");
    categoryCell.classList.add("column-category");
    taskCell.classList.add("column-todo-task");
    completedCell.classList.add("column-completed");
    deleteCell.classList.add("column-delete");

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
    taskSpan.classList.add("task-span");
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
      for (let i = 0; i < todoData.length; i++) {
        if (todoData[i].id == todo.id) {
          todoData[i].completed = completedCheckbox.checked;
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
      for (let i = 0; i < todoData.length; i++) {
        if (todoData[i].id == todo.id) {
          todoData.splice(i, 1);
          saveTodoList();
          renderHTML();
        }
      }
    }
  }

  function hideColumns() {
    let showDateAdded = showDateAddedCB.checked;
    let showCategory = showCategoryCB.checked;
    let showTodoTask = showTodoTaskCB.checked;
    let showDateDue = showDateDueCB.checked;
    let showCompleted = showCompletedCB.checked;
    let showDelete = showDeleteCB.checked;

    let tableRows = todoTable.getElementsByTagName("tr");

    Array.from(tableRows).forEach((row) => {
      Array.from(row.children).forEach((column) => {
        if (column.classList.contains("column-date-added") && !showDateAdded)
          column.remove();

        if (column.classList.contains("column-date-added") && !showDateAdded)
          column.remove();

        if (column.classList.contains("column-category") && !showCategory)
          column.remove();

        if (column.classList.contains("column-todo-task") && !showTodoTask)
          column.remove();

        if (column.classList.contains("column-date-due") && !showDateDue)
          column.remove();

        if (column.classList.contains("column-completed") && !showCompleted)
          column.remove();

        if (column.classList.contains("column-delete") && !showDelete)
          column.remove();
      });
    });
  }

  function populateCategoryOptions() {
    let optionsSet = getCategoryOptionsSet();
    let selectedCategory = sortCategoryElem.value;

    // Note: populate category-list as well
    populateCategoryInputOptions(optionsSet);

    // Remove options
    let optionsToRemove = sortCategoryElem.options.length;
    for (let i = 1; i < optionsToRemove; i++) {
      sortCategoryElem.options[1].remove();
    }

    // Populate options
    for (let option of optionsSet) {
      sortCategoryElem.appendChild(createCategoryOption(option));
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
    let selectedCategory = categoryInputList.value;

    Array.from(categoryInputList.options).forEach((option) => {
      option.remove();
    });

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

    todoData.forEach((todo) => {
      options.push(todo.category);
    });

    return new Set(options);
  }
}
