const addTodoBtn = document.getElementById("addTodoBtn")
const inputTag = document.getElementById("todoInput")
const todoListUl = document.getElementById("todoList")
const remaining = document.getElementById("remaining-count")
const clearCompletedBtn = document.getElementById("clearCompletedBtn")
const clearListBtn =document.getElementById("clearListBtn")
// FIXED TYPOS HERE
const Allbtn = document.getElementById("All")
const Activebtn = document.getElementById("Active")
const Completedbtn = document.getElementById("Done")

let todos = [];
let todosString = localStorage.getItem("todos")

if (todosString) {
    todos = JSON.parse(todosString);
    updateRemainingCount();
}

// Function to update the "Items Left" number
function updateRemainingCount() {
    const count = todos.filter(item => !item.isCompleted).length;
    remaining.innerHTML = count;
}

// MODIFIED: Takes a 'list' as a parameter so we can filter view without deleting data
const populateTodos = (listToDisplay = todos) => {
    let string = ""; 
    for (const todo of listToDisplay) {
        string += `
        <li id="${todo.id}" class="todo-item ${todo.isCompleted ? "completed" : ""}">
            <input type="checkbox" class="todo-checkbox" ${todo.isCompleted ? "checked" : ""} >
            <span class="todo-text">${todo.title}</span>
            <button class="delete-btn">×</button>
        </li>` 
    }
    todoListUl.innerHTML = string;

    // Attach Checkbox Listeners
    document.querySelectorAll(".todo-checkbox").forEach((element) => {
        element.addEventListener("click", (e) => {
            const id = element.parentNode.id;
            todos = todos.map(t => t.id === id ? { ...t, isCompleted: e.target.checked } : t);
            
            localStorage.setItem("todos", JSON.stringify(todos));
            updateRemainingCount();
            populateTodos(); // Refresh view
        });
    });

    // Attach Delete Listeners
    document.querySelectorAll(".delete-btn").forEach((element) => {
        element.addEventListener("click", (e) => {
            if(confirm("Do you want to delete this?")) {
                const id = e.target.parentNode.id;
                todos = todos.filter(t => t.id !== id);
                localStorage.setItem("todos", JSON.stringify(todos));
                updateRemainingCount();
                populateTodos();
            }
        });
    });
}

// FILTER BUTTON LOGIC (Fixed so it doesn't delete data)
Allbtn.addEventListener("click", () => populateTodos(todos));

Activebtn.addEventListener("click", () => {
    const activeTodos = todos.filter(t => !t.isCompleted);
    populateTodos(activeTodos);
});

Completedbtn.addEventListener("click", () => {
    const doneTodos = todos.filter(t => t.isCompleted);
    populateTodos(doneTodos);
});

clearCompletedBtn.addEventListener("click", () => {
    todos = todos.filter(t => !t.isCompleted);
    localStorage.setItem("todos", JSON.stringify(todos));
    updateRemainingCount();
    populateTodos();
});

clearListBtn.addEventListener("click", () => {
    if(confirm("Do you want to delete the whole list?"))
        {
    todos = todos.filter(t => !t.isCompleted);
    todos = todos.filter(t => t.isCompleted);
    localStorage.setItem("todos", JSON.stringify(todos));
    updateRemainingCount();
    populateTodos();
    }
});

addTodoBtn.addEventListener("click", () => {
    let todoText = inputTag.value;
    if(todoText.trim().length < 4) {
        alert("Too short!");
        return;
    }
    const newTodo = {
        id: "todo-" + Date.now(),
        title: todoText,
        isCompleted: false
    };
    todos.push(newTodo);
    inputTag.value = "";
    localStorage.setItem("todos", JSON.stringify(todos));
    updateRemainingCount();
    populateTodos();
});

populateTodos();