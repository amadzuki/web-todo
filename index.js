"use strict"

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

// assignments
const todoContainer = document.getElementById("todo-container")
const newTodoContainer = document.getElementById("new-todo-container")
const searchBox = document.getElementById("search-box-todo")
const hideMenuButton = document.getElementById("hide-menu")
const sideMenuTodoText = document.getElementById("detail-todo-text")
const sideMenuTodoCompleted = document.getElementById("detail-todo-completed")
const sideMenuTodoFavorite = document.getElementById("detail-todo-favorite")
const sideMenuTodoDueDate = document.getElementById("detail-todo-duedate")
const sideMenuTodoRemove = document.getElementById("detail-remove-todo")
const dateToday = document.getElementById("time-today")
var currentIndex = null
const favoriteOn = "&#9733;"
const favoriteOff = "&#9734;"
const bulletDone = "&#11044;"
const bulletNotDone = "&#9711;"

// FUNCTIONS ----------------------------------------------------------

// display today's date
dateToday.innerHTML = moment().format("MMMM Do YYYY")

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
    const textTodo = setNewElement("div")
    textTodo.setAttribute("tabindex", "0")
    textTodo.addEventListener("click", showDetailTodo)
    textTodo.innerHTML = todo.text
    newListContainer.append(textTodo)
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
    todoContainer.append(newListContainer)
  })
}

// create latest ID for new todo object
const newID = () => {
  if (allTodos.length === 0) {
    const firstID = 1
    return firstID
  }
  const lastID = allTodos.reduce((max, todo) => Math.max(max, todo.id), 0)
  const newIDValue = lastID + 1
  return newIDValue
}

const setNewInputBox = function () {
  const newInputDiv = setNewElement("div")
  newInputDiv.setAttribute("class", "todo-list")
  newInputDiv.innerHTML = bulletNotDone
  const newInputElement = setNewElement("input")
  newInputDiv.append(newInputElement)
  newInputElement.addEventListener("focusout", getText)
  newInputElement.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      try {
        this.parentNode.remove()
      } catch (error) {
        setNewInputBox()
      }
    }
  })
  todoContainer.append(newInputDiv)
  newInputElement.focus()
}

const getText = function () {
  if (this.value === "") {
    return this.parentNode.remove()
  }
  const idValue = newID()
  const newTodo = { id: idValue, text: this.value }
  allTodos.push(new Todo(newTodo))
  this.parentNode.dataset.id = idValue
  saveToStorage()
  this.parentNode.remove()
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
  const currentID = this.parentNode.dataset.id
  currentIndex = allTodos.findIndex((todo) => todo.id == currentID)
  const selectedTodo = allTodos[currentIndex]
  sideMenuTodoText.innerText = selectedTodo.text
  sideMenuTodoText.addEventListener("click", editTodoText)
  sideMenuTodoCompleted.innerText = selectedTodo.completed
    ? "It's completed"
    : "You haven't cleared it yet"
  sideMenuTodoFavorite.innerText = selectedTodo.favorite
    ? "Important task"
    : "Not-so-important task"
  sideMenuTodoDueDate.addEventListener("click", setDueDate)
  sideMenuTodoRemove.addEventListener("click", removeTodo)
  document.getElementById("side-menu").style.left = "70vw"
  document.body.style.backgroundColor = "#333"
}

const closeDetailTodo = () => {
  document.getElementById("side-menu").style.left = "100vw"
  document.body.style.backgroundColor = " #1f1c1e"
}

const editTodoText = function () {
  const formerText = sideMenuTodoText.innerText
  const inputNewTodoText = setNewElement("input")
  inputNewTodoText.value = formerText
  sideMenuTodoText.innerHTML = ""
  sideMenuTodoText.append(inputNewTodoText)
  inputNewTodoText.focus()
  inputNewTodoText.addEventListener("blur", function () {
    const editedText = this.value
    allTodos[currentIndex].setNewText(editedText)
    sideMenuTodoText.innerText = editedText
  })
  // this one is pretty counter intuitive, make sure to comprehend the blur event
  inputNewTodoText.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      try {
        sideMenuTodoText.innerText = "error"
      } catch (error) {}
    }
  })
}
// remove single todo
const removeTodo = () => {
  allTodos.splice(currentIndex, 1)
  closeDetailTodo()
  todoContainer.innerHTML = ""
  displayList(allTodos)
  saveToStorage()
  currentID = null
}
//set due date
const setDueDate = () => {
  const textDueDate = document.getElementById("text-due-date")
  const dateInputContainer = document.getElementById("due-date-input-block")
  dateInputContainer.style.display = "block"
  const dueDateInput = document.getElementById("due-date-input")
  dueDateInput.addEventListener("focusout", function () {
    if (this.value == null || this.value == "") {
      dateInputContainer.style.display = "none"
    } else {
      allTodos[currentIndex].setDueDate(this.value)
      textDueDate.innerHTML = `Finish it ${moment(this.value).fromNow()}`
      dateInputContainer.style.display = "none"
    }
  })
}
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
