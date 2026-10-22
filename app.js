let tasks = loadTasks();
let currentFilter = "all";

const form = document.getElementById("form");
const input = document.getElementById("text");
const list = document.getElementById("list");
const count = document.getElementById("count");
const filterButtons = document.querySelectorAll(".filter");
const clearButton = document.getElementById("clear");

function loadTasks() {
  try {
    return JSON.parse(localStorage.getItem("tasks")) || [];
  } catch (error) {
    return [];
  }
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
  list.innerHTML = "";

  const visibleTasks = tasks.filter(function (task) {
    if (currentFilter === "active") return !task.done;
    if (currentFilter === "done") return task.done;
    return true;
  });

  visibleTasks.forEach(function (task) {
    const li = document.createElement("li");
    li.dataset.id = task.id;

    if (task.done) li.classList.add("done");

    const span = document.createElement("span");
    span.className = "task-text";
    span.textContent = task.text;

    const doneButton = document.createElement("button");
    doneButton.type = "button";
    doneButton.className = "task-btn";
    doneButton.dataset.action = "toggle";
    doneButton.textContent = task.done ? "Undo" : "Done";

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "delete-btn";
    deleteButton.dataset.action = "delete";
    deleteButton.textContent = "Delete";

    li.append(span, doneButton, deleteButton);
    list.appendChild(li);
  });

  const remaining = tasks.filter(function (task) {
    return !task.done;
  }).length;

  count.textContent =
    remaining + (remaining === 1 ? " task left" : " tasks left");
}

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const text = input.value.trim();

  if (text === "") return;

  tasks.push({
    id: Date.now(),
    text: text,
    done: false,
  });

  input.value = "";
  saveTasks();
  renderTasks();
});

list.addEventListener("click", function (event) {
  const action = event.target.dataset.action;

  if (!action) return;

  const li = event.target.closest("li");
  const id = Number(li.dataset.id);

  if (action === "toggle") {
    tasks.forEach(function (task) {
      if (task.id === id) {
        task.done = !task.done;
      }
    });
  }

  if (action === "delete") {
    tasks = tasks.filter(function (task) {
      return task.id !== id;
    });
  }

  saveTasks();
  renderTasks();
});

filterButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    currentFilter = button.dataset.filter;

    filterButtons.forEach(function (item) {
      item.classList.remove("active");
    });

    button.classList.add("active");
    renderTasks();
  });
});

clearButton.addEventListener("click", function () {
  tasks = tasks.filter(function (task) {
    return !task.done;
  });

  saveTasks();
  renderTasks();
});

renderTasks();
