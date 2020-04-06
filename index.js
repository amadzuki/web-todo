class Todo {
  constructor(objectConstructor) {
    Object.assign(this, objectConstructor)
  }

  setNewText(newText) {
    this.text = newText
  }

  setDueDate = (date) => {
    this.dueDate = date
  }

  isFavorite = () => {
    !this.hasOwnProperty("favorite")
      ? (this.favorite = true)
      : delete this.favorite
  }

  isCompleted() {
    !this.hasOwnProperty("completed")
      ? (this.completed = true)
      : delete this.completed
  }
}

// useful assignment
const todoContainer = document.getElementById("todo-container")
const newTodoContainer = document.getElementById("new-todo-container")
const searchBox = document.getElementById("search-box-todo")
const hideMenuButton = document.getElementById("hide-menu")
const sideMenuTodoText = document.getElementById("detail-todo-text")
const sideMenuTodoCompleted = document.getElementById("detail-todo-completed")
const sideMenuTodoFavorite = document.getElementById("detail-todo-favorite")
const sideMenuTodoDueDate = document.getElementById("detail-todo-duedate")
const favoriteOn = "&#9733;"
const favoriteOff = "&#9734;"
const bulletDone = "&#11044;"
const bulletNotDone = "&#9711;"

// FUNCTIONS ----------------------------------------------------------

const setNewElement = (tagName) => document.createElement(tagName)
const saveToStorage = () => {
  localStorage.setItem("allTodosData", JSON.stringify(allTodos))
}

const iconSwitcher = function (currentElement) {
  const currentID = currentElement.parentNode.dataset.id
  const currentTodo = allTodos.find((todo) => todo.id == currentID)
  if (currentElement.className === "completed-toggle") {
    currentTodo.isCompleted()
    saveToStorage()

    if (currentTodo.completed) {
      currentElement.nextSibling.setAttribute(
        "class",
        "todo-text strikethrough"
      )
      currentElement.innerHTML = bulletDone
    } else {
      currentElement.nextSibling.setAttribute("class", "todo-text")
      currentElement.innerHTML = bulletNotDone
    }
  } else if (currentElement.className === "favorite-toggle") {
    currentTodo.isFavorite()
    saveToStorage()
    currentTodo.favorite
      ? (currentElement.innerHTML = favoriteOn)
      : (currentElement.innerHTML = favoriteOff)
  }
}

// display data from storage
const displayList = (arrayList) => {
  arrayList.map((todo) => {
    const newListContainer = setNewElement("div")
    newListContainer.setAttribute("class", "todo-list")
    newListContainer.setAttribute("data-id", todo.id)
    const completedToggle = setNewElement("div")
    completedToggle.setAttribute("class", "completed-toggle")
    completedToggle.setAttribute("onclick", "iconSwitcher(this)")

    const favoriteToggle = setNewElement("div")
    favoriteToggle.setAttribute("class", "favorite-toggle")
    favoriteToggle.setAttribute("onclick", "iconSwitcher(this)")
    // still looking a way to make this into a function
    todo.favorite
      ? (favoriteToggle.innerHTML = favoriteOn)
      : (favoriteToggle.innerHTML = favoriteOff)
    newListContainer.innerHTML = `<div tabindex="0">${todo.text}</div>`
    newListContainer.prepend(completedToggle)
    newListContainer.append(favoriteToggle)
    //this too
    if (todo.completed) {
      completedToggle.nextSibling.setAttribute(
        "class",
        "todo-text strikethrough"
      )
      completedToggle.innerHTML = bulletDone
    } else {
      completedToggle.nextSibling.setAttribute("class", "todo-text")
      completedToggle.innerHTML = bulletNotDone
    }
    newListContainer.addEventListener("click", showDetailTodo)
    todoContainer.append(newListContainer)
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

const setNewInputBox = function () {
  const newInputElement = setNewElement("div")
  newInputElement.setAttribute("class", "todo-list")
  newInputElement.innerHTML = `${bulletNotDone}<input type="text" onfocusout="getText(this)">`
  todoContainer.append(newInputElement)
  newInputElement.lastChild.focus()
}

const getText = (textBox) => {
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
// search: filter by text
const filterByText = () => {
  const searchText = searchBox.value
  const regexSearch = new RegExp(searchText, "i")
  const todoFiltered = allTodos.filter((todo) => regexSearch.test(todo.text))
  todoContainer.innerHTML = ""
  displayList(todoFiltered)
}

// show metadata todo
const showDetailTodo = function () {
  const todoID = this.dataset.id
  const selectedTodo = allTodos.find((todo) => todo.id == todoID)
  sideMenuTodoText.innerText = selectedTodo.text
  sideMenuTodoCompleted.innerText = selectedTodo.completed
    ? "It's completed"
    : "You haven't cleared it yet"
  sideMenuTodoFavorite.innerText = selectedTodo.favorite
    ? "Important task"
    : "Not-so-important task"
  sideMenuTodoDueDate.innerText = "//trying to use moment.js"
  document.getElementById("side-menu").style.left = "70vw"
  document.body.style.backgroundColor = "rgba(0,0,0,0.3)"
}

const closeDetailTodo = () => {
  document.getElementById("side-menu").style.left = "100vw"
  document.body.style.backgroundColor = "#fff"
}

// remove one task
//---------------------------------------------------------------------

// INITIATE LIST-----------------------------------------------------------
let allTodos = []
if (localStorage.getItem("allTodosData") !== null) {
  const allTodosData = JSON.parse(localStorage.getItem("allTodosData"))
  allTodos = allTodosData.map((object) => new Todo(object))
  displayList(allTodos)
}
//-----------------------------------------------------------------------

// EVENT LISTENER -------------------------------------------------------
newTodoContainer.addEventListener("click", setNewInputBox)
searchBox.addEventListener("input", filterByText)
hideMenuButton.addEventListener("click", closeDetailTodo)
