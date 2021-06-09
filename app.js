class ToDo {
  constructor(text) {
    this.text = text,
    this.isComplited = false
    this.id = `task-${Math.random()}`
  }
}

let a = new ToDo('buy milk')
let b = new ToDo('create app')
let c = new ToDo('homework')
let d = new ToDo('repair bicycle')

class ToDoList {
  constructor(selectedHtmlElement) {
    this.tasks = [a, b, c, d,]
    this.selectedHtmlElement = selectedHtmlElement || document.body
    this.render(this.tasks)
  }

  render(chosenTaskArr){
    this.selectedHtmlElement.innerHTML = ''
    this.addFormForAddingTasks()
    this.addListWithTasks(chosenTaskArr)
  }

  addTaskToList(text) {
    if (text == '' || text == null) {
      alert('There isnt any task to add!')
    } else {
      this.tasks.push(new ToDo(text))
    }
    this.render(this.tasks)
  }

  addListWithTasks(chosenTaskArr) {
    console.log(chosenTaskArr)
    const ul = document.createElement('ul')
    const btnClrAll = document.createElement('button')

    ul.className = 'todo-list'

    btnClrAll.classList.add('clear-all-btn')
    btnClrAll.textContent = 'Clear'

    chosenTaskArr.forEach((task, taskIndex) => {
      const li = document.createElement('li')
      li.classList.add('task-item')
      li.setAttribute('data-task-id', task.id)
  
      const removeTaskBtn = document.createElement('button')
      removeTaskBtn.classList.add('delete-task-button')
      removeTaskBtn.textContent = 'X'
  
      const checkbox = document.createElement('input')
      checkbox.setAttribute('type', 'checkbox')
      if(task.isComplited) {
          checkbox.setAttribute('checked', '')
      }
      checkbox.classList.add('task-checkbox')
  
      const taskText = document.createElement('span')
      taskText.classList.add('task-text')
      taskText.textContent = task.text
      if(task.isComplited) {
        checkbox.setAttribute('checked', '')
        taskText.classList.toggle('task-done')
      }

      taskText.addEventListener('click', (e) => {
        const closestParent = e.target.closest('[data-task-id]')
        const identificator = closestParent.dataset.taskId
        if(clickDelay) clearTimeout(clickDelay)

        clickDelay = setTimeout(() => {
          if(e.target.previousElementSibling.checked) {
            e.target.classList.toggle('task-done')
            e.target.previousElementSibling.checked = false
            this.tasks.forEach(task => {
              if(task.id === identificator) {
                let index = this.tasks.indexOf(task, 0)
                task.isComplited = false
              }
            })  
          } else {
            e.target.classList.toggle('task-done')
            e.target.previousElementSibling.checked = true
            this.tasks.forEach(task => {
              if(task.id === identificator) {
                let index = this.tasks.indexOf(task, 0)
                task.isComplited = true
              }
            })  
          }
        }, 180)
        console.log(clickDelay)
      })

      taskText.addEventListener('dblclick',(e) => {
        const closestParent = e.target.closest('[data-task-id]')
        const identificator = closestParent.dataset.taskId
    
        clearTimeout(clickDelay)
        e.target.setAttribute('contenteditable', 'true')  
        e.target.focus()
      })

      removeTaskBtn.addEventListener('click', (e) => {
        const closestParent = e.target.closest('[data-task-id]')
        const identificator = closestParent.dataset.taskId

        closestParent.remove()
          
        this.tasks.forEach(task => {
          if(task.id === identificator) {
            let index = this.tasks.indexOf(task, 0)
            this.tasks.splice(index, 1)
          } 
        })
      })

      taskText.addEventListener('focusout', (e) => {
        const closestParent = e.target.closest('[data-task-id]')
        const identificator = closestParent.dataset.taskId
    
        e.target.setAttribute('contenteditable', 'false')
    
        this.tasks.forEach(task => {
            if(task.id === identificator) {
                let index = this.tasks.indexOf(task, 0)
                task.text = e.target.textContent
            } 
        })    
      })

      taskText.addEventListener('keypress', (e) => {
        if(e.key === 'Enter') {
          e.preventDefault()
          e.target.blur()
        }
      })

      checkbox.addEventListener('click', (e) => {
        const closestParent = e.target.closest('[data-task-id]')
        const identificator = closestParent.dataset.taskId

        if(e.target.checked) {
          e.target.nextElementSibling.classList.toggle('task-done')
          this.tasks.forEach(task => {
            if(task.id === identificator) {
              let index = this.tasks.indexOf(task, 0)
              task.done = true
            } 
          })
      
          } else {
              e.target.nextElementSibling.classList.toggle('task-done')
    
              this.tasks.forEach(task => {
                if(task.id === identificator) {
                  let index = this.tasks.indexOf(task, 0)
                  task.done = false
                } 
              })
          }
      })

      li.append(removeTaskBtn)
      li.append(checkbox)
      li.append(taskText)

      ul.appendChild(li)
    })

    btnClrAll.addEventListener('click', (e) => {
        if(this.tasks.length < 1) {
          this.drawModalAlert()
          return
        }
        this.drawModalConfirm()
    })


    this.selectedHtmlElement.append(ul)
    this.selectedHtmlElement.append(btnClrAll)
  }

  addFormForAddingTasks() {
    const input = document.createElement('input')
    const addBtn = document.createElement('button')

    input.className = 'add-task--input'
    input.autofocus = true
    input.placeholder = 'Add Task'

    addBtn.innerText = 'ADD'
    addBtn.classList.add('add-task-btn')

    addBtn.addEventListener('click', () => this.addTaskToList(input.value))
    input.addEventListener('keypress', (e) => {
      if(e.key === 'Enter') {
        e.preventDefault()
        this.addTaskToList(input.value)
      }
    })

    this.selectedHtmlElement.appendChild(input)
    this.selectedHtmlElement.appendChild(addBtn)
  }

  drawModalAlert() {
    let modal = document.createElement('div')
    modal.innerHTML = 
    `
    <div class="modal modal__alert">
      <div class="modal__window">
        <div class="modal__container">
          <div class="modal__text-container">
            <p class="modal__text">
              Task list is already empty!
            </p>
          </div>
          <div class="modal__btn-container">
            <button class="modal__ok-btn">
              Ok
            </button>
          </div>
        </div>
      </div>
    </div>
    `
    modal.addEventListener('click', (e) => {
      if(e.target.classList.contains('modal__ok-btn')) {
        modal.innerHTML = ''
      }
    })

    this.selectedHtmlElement.append(modal)
  }

  drawModalConfirm() {
    let modalConf = document.createElement('div')
    modalConf.innerHTML = 
    `
    <div class="modal modal__confirm">
      <div class="modal__window">
        <div class="modal__container">
          <div class="modal__text-container">
            <p class="modal__text">
              Are you sure, that you want to clear the task list?
            </p>
          </div>
          <div class="modal__btn-container">
            <button class="modal__cancel-btn">
              Cancel
            </button>
            <button class="modal__ok-btn">
              Ok
            </button>
          </div>
        </div>
      </div>
    </div>
    `
    modalConf.addEventListener('click', (e) => {
      let ul = document.querySelector('todo-list')
      if(e.target.classList.contains('modal__ok-btn')) {
        this.tasks.splice(0, this.tasks.length)
        this.render(this.tasks)
        modalConf.innerHTML = ''
      } else if((e.target.classList.contains('modal__cancel-btn'))){
        modalConf.innerHTML = ''
      }
    })

    this.selectedHtmlElement.append(modalConf)
  }
}

let clickDelay
let someDiv = document.querySelector('.todo')
const todo = new ToDoList(someDiv)