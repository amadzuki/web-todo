class Todo {
  constructor(objectConstructor) {
    Object.assign(this, objectConstructor)
  }

  setNewText(newText) {
    this.text = newText
  }

  setDueDate = date => {
    this.dueDate = date
  }

  isFavorite = () => {
    !this.hasOwnProperty("favorite")
      ? (this.favorite = true)
      : delete this.favorite
  }

  isCompleted() {
    this.hasOwnProperty("compeleted")
      ? (this.completed = true)
      : delete this.completed
  }
}

// FUNCTIONS ----------------------------------------------------------
// useful assignment
const todoContainer = document.getElementById("todo-container")
const newTodoContainer = document.getElementById("new-todo-container")

const setNewElement = tagName => document.createElement(tagName)
const saveToStorage = () => {
  localStorage.setItem("allTodosData", JSON.stringify(allTodos))
}

const favoriteSwitch = function(currentElement) {
  const currentID = currentElement.parentNode.dataset.id
  const currentTodo = allTodos.find(todo => todo.id == currentID)
  currentTodo.isFavorite()
  currentTodo.favorite
    ? (currentElement.innerHTML = "&#9733;")
    : (currentElement.innerHTML = "&#9734;")
}

// display data from storage
const displayList = arrayList => {
  arrayList.map(todo => {
    const newListContainer = setNewElement("div")
    newListContainer.setAttribute("class", "todo-list")
    newListContainer.setAttribute("data-id", todo.id)
    const completedToggle = setNewElement("div")
    completedToggle.setAttribute("class", "completed-toggle")
    const favoriteToggle = setNewElement("div")
    favoriteToggle.setAttribute("class", "favorite-toggle")
    favoriteToggle.setAttribute("onclick", "favoriteSwitch(this)")
    favoriteToggle.innerHTML = "&#9734;"
    newListContainer.innerHTML = `<div class="todo-text" tabindex="0">${todo.text}</div>`
    newListContainer.prepend(completedToggle)
    newListContainer.append(favoriteToggle)
    todoContainer.insertBefore(newListContainer, newTodoContainer)
  })
}

// create latest ID for new todo object
const newID = () => {
  if (allTodos.length === 0) {
    firstID = 1
    return firstID
  }
  const lastID = allTodos.reduce((max, todo) => Math.max(max, todo.id), 0)
  const newIDValue = lastID + 1
  return newIDValue
}

const setNewInputBox = function() {
  newInputElement = setNewElement("div")
  newInputElement.setAttribute("class", "todo-list")
  newInputElement.innerHTML = `<input type="text" onfocusout="getText(this)">`
  newTodoContainer.before(newInputElement, newTodoContainer)
  newInputElement.firstChild.focus()
}

const getText = textBox => {
  if (textBox.value === "") {
    return textBox.parentNode.remove()
  }
  const idValue = newID()
  const newTodo = { id: idValue, text: textBox.value }
  allTodos.push(new Todo(newTodo))
  textBox.parentNode.dataset.id = idValue
  saveToStorage()
  textBox.parentNode.remove()
  displayList([newTodo])
}
//---------------------------------------------------------------------

// INITIATE LIST-----------------------------------------------------------
let allTodos = []
if (localStorage.getItem("allTodosData") !== null) {
  const allTodosData = JSON.parse(localStorage.getItem("allTodosData"))
  allTodos = allTodosData.map(object => new Todo(object))
  displayList(allTodos)
}
//-----------------------------------------------------------------------

// EVENT LISTENER -------------------------------------------------------
newTodoContainer.addEventListener("click", setNewInputBox)
