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

  isFavorite = boolean => {
    if (boolean) {
      this.favorite = boolean
    } else {
      delete this.favorite
    }
  }
}

// FUNCTIONS ----------------------------------------------------------

const saveToStorage = () => {
  localStorage.setItem("allTodosData", JSON.stringify(allTodos))
}
const setNewElement = tagName => document.createElement(tagName)

// display data from storage
const displayList = arrayList => {
  arrayList.map(todo => {
    const newListContainer = setNewElement("div")
    newListContainer.setAttribute("data-id", todo.id)
    newListContainer.innerHTML = `<div class="check-bullet"></div><div>${todo.text}</div>`
    todoContainer.insertBefore(newListContainer, newTodoContainer)
  })
}
//---------------------------------------------------------------------

// useful assignment
const todoContainer = document.getElementById("todo-container")
const newTodoContainer = document.getElementById("new-todo-container")

// INITIATE
let allTodos = []
if (localStorage.getItem("allTodosData") !== null) {
  allTodosData = JSON.parse(localStorage.getItem("allTodosData"))
  allTodos = allTodosData.map(object => new Todo(object))
  displayList(allTodos)
}

const newID = () => {
  if (allTodos.length === 0) {
    firstID = 1
    return firstID
  }
  const lastID = allTodos.reduce((max, todo) => Math.max(max, todo.id), 0)
  const newIDValue = lastID + 1
  return newIDValue
}

/* insert new input element on click */
const setNewInputBox = function() {
  newInputElement = setNewElement("div")
  newInputElement.setAttribute("class", "todo-list")
  newInputElement.innerHTML = `<input type="text" onfocusout="getText(this)">`
  newTodoContainer.before(newInputElement, newTodoContainer)
  newInputElement.firstChild.focus()
}
newTodoContainer.addEventListener("click", setNewInputBox)

// Add the text into array of objects
const getText = textBox => {
  const idValue = newID()
  const newTodo = { id: idValue, text: textBox.value }
  allTodos.push(new Todo(newTodo))
  textBox.parentNode.dataset.id = idValue
  saveToStorage()
}
