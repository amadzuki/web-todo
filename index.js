class todo {
  constructor(text) {
    this.text
  }

  setNewText(newText) {
    this.text = newText
  }
}
/* when it's clicked, insert new input element before the new-todo-container */
const newInputElement = document.createElement("input")
newInputElement.setAttribute("type", "text")
const newTodoContainer = document.getElementById("new-todo-container")
const todoContainer = document.getElementById("todo-container")
newTodoContainer.addEventListener("click", function() {
  todoContainer.insertBefore(newInputElement, this)
})
