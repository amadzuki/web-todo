class todo {
  constructor(text) {
    this.text
  }

  setNewText(newText) {
    this.text = newText
  }
}
/* when it's clicked, insert new input element before the new-todo-container */

const newTodoContainer = document.getElementById("new-todo-container")
const setNewInputBox = function() {
  const newInputElement = document.createElement("div")
  newInputElement.setAttribute("class", "")
  randomID = Math.random() //just to test
  newInputElement.innerHTML = `<input type="text" data-id="${randomID}">`

  this.before(newInputElement, this)
}
newTodoContainer.addEventListener("click", setNewInputBox)
