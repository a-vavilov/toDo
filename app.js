class EventEmitter {
  constructor() {
    this.events = {}
  }
  on = (someEvent, func) => {
    if(!this.events[someEvent]) {
      this.events[someEvent] = []
    }
    this.events[someEvent].push(func)
  }
  emit = (someEvent, data) => {
    const event = this.events[someEvent]
    if(event) {
      event.forEach(func => {
        func(data)
      })
    }
  }
}

const eventEmiter = new EventEmitter()

class STORE {
  constructor() {
    eventEmiter.on('TODO_ADD', this.onTodoAdd)
    eventEmiter.on('TODO_REMOVE', this.onTodoRemove)
    eventEmiter.on('TODO_CLEAR', this.onTodoClear)
    eventEmiter.on('TODO_COMPLETE', this.onTodoComplete)
    eventEmiter.on('TODO_UNCOMPLETE', this.onTodoUnComplete)
    eventEmiter.on('TODO_EDIT', this.onTodoEdit)
    eventEmiter.on('AUTORIZATION', this.onAutorization)
    eventEmiter.on('SIGNED_IN', this.onSignedIn)
    this.appState = {
      currentRoute: null,
      currentTasks: null || [],
    }
  }
  
  onTodoAdd = (todo) => {
    this.reducer('TODO_ADD', todo)
  } 

  onTodoRemove = (id) => {
    this.reducer('TODO_REMOVE', id)
  }

  onTodoClear = () => {
    this.reducer('TODO_CLEAR')
  }

  onTodoComplete = (id) => {
    this.reducer('TODO_COMPLETE', id)
  }

  onTodoUnComplete = (id) => {
    this.reducer('TODO_UNCOMPLETE', id)
  }

  onTodoEdit = (data) => {
    this.reducer('TODO_EDIT', data)
  }

  onAutorization = () => {
    this.reducer('AUTORIZATION')
  }

  onSignedIn = () => {
    this.reducer('SIGNED_IN')
  }

  reducer(action, data) {
    switch(action) {
      case 'TODO_ADD': 
        this.appState.currentTasks.push(data)
        eventEmiter.emit('RERENDER', 'todo')
        break
      case 'TODO_REMOVE': 
        const newState = this.appState.currentTasks = this.appState.currentTasks.filter(task => task.id !== data)
        this.appState.currentTasks = newState
        eventEmiter.emit('RERENDER', 'todo')
        break
      case 'TODO_CLEAR': 
        this.appState.currentTasks = []
        eventEmiter.emit('RERENDER', 'todo')
        break
      case 'TODO_COMPLETE': 
        this.appState.currentTasks.forEach(task => {
          if(task.id === data) {
            task.isComplited = false
          }
        })
        eventEmiter.emit('RERENDER', 'todo')
        break
      case 'TODO_UNCOMPLETE': 
        this.appState.currentTasks.forEach(task => {
          if(task.id === data) {
            task.isComplited = true
          }
        })
        eventEmiter.emit('RERENDER', 'todo')
        break
      case 'TODO_EDIT':
        this.appState.currentTasks.forEach(task => {
          if(task.id === data.id) {
            task.text = data.text
          }
        })
        eventEmiter.emit('RERENDER', 'todo')
        break
      case 'AUTORIZATION':
        this.appState.currentState = 'form'
        eventEmiter.emit('RERENDER', 'form')
        break
      case 'SIGNED_IN':
        this.appState.currentState = 'todo'
        eventEmiter.emit('RERENDER', 'todo')
        break  
    }
  }
}

class ROOT {
  constructor() {
      eventEmiter.on("RERENDER", this.render)
      this.body = document.body
  }

  render = (action) => {
    switch(action) {
      case 'todo':
        this.body.innerHTML = ''
        const todo = new ToDoList({ appState: this.appState })
        this.body.append(todo.render())
        todo.input.focus()
        break
      case 'form':
        this.body.innerHTML = ''
        const form = new FormLogin()
        this.body.append(form.render())
        form.inputEmail.focus()
        break
    }
  }
}

class FormLogin {
  constructor(props) {
    this.regExpDic = {
      email: /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/,
      password: /^[0-9a-zA-Z]{4,}$/,
    }
  }

  submit = (e) => {
    e.preventDefault()
    this.inputs = [this.inputPassword, this.inputEmail]
    const isValidForm = this.inputs.every( el => {
      const isValidInput = this.validate(el)
      return isValidInput
    })
    if(isValidForm) {
      eventEmiter.emit('SIGNED_IN')
    } else {
      let modal = new Modal(
        { 
        text:'Please, fill in all fields correctly! Email must be like "email@email.com". Password minimum length is 4 symbols!', 
        type: 'alert',
        appState: this.appState
        }
      )
      this.form.reset()
      document.body.append(modal.render())
      modal.okBtn.focus()
    }
  }

  validate = (el) => {
    let regExpName = el.dataset.required
    return this.regExpDic[regExpName].test(el.value)
  }

  render() {
    this.form = document.createElement('form')
    this.form.name = 'formLogin'
    this.form.classList.add('form-login')

    this.title = document.createElement('h2')
    this.title.textContent = 'Sign in'
    this.title.classList.add('form-login__title')

    this.inputEmail = document.createElement('input')
    this.inputEmail.classList.add('form-login__input')
    this.inputEmail.placeholder = 'Enter email'
    this.inputEmail.setAttribute('data-required', 'email')
    this.inputEmail.value = 'admin@gmail.com'

    this.inputPassword = document.createElement('input')
    this.inputPassword.classList.add('form-login__input')
    this.inputPassword.type = 'password'
    this.inputPassword.value = '123456789'
    this.inputPassword.placeholder = 'Enter password'
    this.inputPassword.setAttribute('data-required', 'password')

    this.submitBtn = document.createElement('button')
    this.submitBtn.type = 'submit'
    this.submitBtn.textContent = 'Submit'
    this.submitBtn.classList.add('form-login__btn-submit')

    this.form.append(this.title)
    this.form.append(this.inputEmail)
    this.form.append(this.inputPassword)
    this.form.append(this.submitBtn)

    this.form.addEventListener('submit', this.submit)

    this.inputEmail.focus()

    return this.form
  }
}

class Modal {
  constructor(props) {
    this.text = props.text
    this.type = props.type
    // this.appState = props.appState
    this.okBtnHandler = props.okBtnHandler
  }

  close = (e) => {
    this.modal.remove()
  }

  onOkHandler = () => {
    if(this.okBtnHandler) {
      this.okBtnHandler()
    }
    this.close()
  }

  render = () => {
    if(this.type === 'confirm'){
      this.modal = document.createElement('div')
      this.modal.classList.add('modall', 'modal__confirm')
  
      this.modalWindow = document.createElement('div')
      this.modalWindow.classList.add('modal__window')
  
      this.modalContainer = document.createElement('div')
      this.modalContainer.classList.add('modal__container')
  
      this.modalTextContainer = document.createElement('div')
      this.modalTextContainer.classList.add('modal__text-container')
  
      this.modalText = document.createElement('p')
      this.modalText.classList.add('modal__text')
      this.modalText.textContent = this.text
  
      this.modalBtnContainer = document.createElement('div')
      this.modalBtnContainer.classList.add('modal__btn-container')
  
      this.cancelBtn = document.createElement('button')
      this.cancelBtn.textContent = 'Cancel'
      this.cancelBtn.classList.add('modal__cancel-btn')

      this.okBtn = document.createElement('button')
      this.okBtn.textContent = 'Ok'
      this.okBtn.classList.add('modal__ok-btn')
  
      this.modal.append(this.modalWindow)
      this.modalWindow.append(this.modalContainer)
      this.modalContainer.append(this.modalTextContainer)
      this.modalTextContainer.append(this.modalText)
      this.modalContainer.append(this.modalBtnContainer)
      this.modalBtnContainer.append(this.cancelBtn)
      this.modalBtnContainer.append(this.okBtn)
  
      this.cancelBtn.addEventListener('click', this.close)
      this.okBtn.addEventListener('click', this.onOkHandler)

      return this.modal

    } else if(this.type === 'alert') {
      this.modal = document.createElement('div')
      this.modal.classList.add('modall', 'modal__confirm')
  
      this.modalWindow = document.createElement('div')
      this.modalWindow.classList.add('modal__window')
  
      this.modalContainer = document.createElement('div')
      this.modalContainer.classList.add('modal__container')
  
      this.modalTextContainer = document.createElement('div')
      this.modalTextContainer.classList.add('modal__text-container')
  
      this.modalText = document.createElement('p')
      this.modalText.textContent = this.text
  
      this.modalBtnContainer = document.createElement('div')
      this.modalBtnContainer.classList.add('modal__btn-container')
  
      this.okBtn = document.createElement('button')
      this.okBtn.textContent = 'Ok'
      this.okBtn.classList.add('modal__ok-btn')
  
      this.modal.append(this.modalWindow)
      this.modalWindow.append(this.modalContainer)
      this.modalContainer.append(this.modalTextContainer)
      this.modalTextContainer.append(this.modalText)
      this.modalContainer.append(this.modalBtnContainer)
      this.modalBtnContainer.append(this.okBtn)
  
      this.okBtn.addEventListener('click', this.onOkHandler)

      return this.modal
    }
  }
}

class ToDo {
  constructor(props) {
    this.text = props.text
    this.isComplited = props.isComplited
    this.id = props.id
  }

  todoRemove = () => {
    eventEmiter.emit('TODO_REMOVE', this.id)
  }

  todoIsComplete = (e) => {
    if(this.clickDelay) {
      clearTimeout(this.clickDelay)
    }

    this.clickDelay = setTimeout(() => {
      if(e.target.classList.contains('todo-list__task-done') || e.target.hasAttribute('checked')) {
        eventEmiter.emit('TODO_COMPLETE', this.id) 
      } else {
        eventEmiter.emit('TODO_UNCOMPLETE', this.id) 
      }
    }, 180)

  }

  todoEdit = (e) => {
    clearTimeout(this.clickDelay)
    e.target.setAttribute('contenteditable', 'true')
    e.target.focus()
  }

  focusOutTaskHandler = (e) => {
    e.target.blur()
    eventEmiter.emit('TODO_EDIT', { id: this.id, text: e.target.textContent })
  }

  render = () => {
    this.li = document.createElement('li')
    this.li.classList.add('todo-list__task-item')
    this.li.setAttribute('data-task-id', this.id)

    this.removeTaskBtn = document.createElement('button')
    this.removeTaskBtn.classList.add('todo-list__delete-task-button')
    this.removeTaskBtn.textContent = 'X'

    this.checkbox = document.createElement('input')
    this.checkbox.setAttribute('type', 'checkbox')
    if(this.isComplited) {
      this.checkbox.setAttribute('checked', '')
    }
    this.checkbox.classList.add('todo-list__task-checkbox')

    this.taskText = document.createElement('span')
    this.taskText.classList.add('todo-list__task-text')
    this.taskText.textContent = this.text
    if(this.isComplited) {
      this.checkbox.setAttribute('checked', '')
      this.taskText.classList.toggle('todo-list__task-done')
    }

    this.li.append(this.removeTaskBtn)
    this.li.append(this.checkbox)
    this.li.append(this.taskText)

    this.taskText.addEventListener('click', this.todoIsComplete)

    this.checkbox.addEventListener('click', this.todoIsComplete)

    this.taskText.addEventListener('dblclick', this.todoEdit)
      
    this.removeTaskBtn.addEventListener('click', this.todoRemove)

    this.taskText.addEventListener('focusout', this.focusOutTaskHandler)

    return this.li
  }
}

class ToDoList {
  constructor(props) {
    this.body = document.body
    // this.goTo = props.goTo
    this.appState = store.appState
  }

  addTodo = () => {
    if(this.input.value === '' || this.input.value === false) {
      this.openModalAlert('There is nothing to add!')
      return
    }

    let todo = new ToDo(
      {
        text:this.input.value, 
        id: Math.random()
      }
    )
    eventEmiter.emit('TODO_ADD', todo)
  }

  clearTodoList = (e) => {
    eventEmiter.emit('TODO_CLEAR')
  }

  openModalConfirm = (e) => {
    let modal = new Modal(
      { 
      text: 'r u sure that u wanna clear this todo list?', 
      okBtnHandler:this.clearTodoList, 
      type: 'confirm',
      appState: this.appState
      }
    )
    this.body.append(modal.render())
    modal.okBtn.focus()
  }

  openModalAlert = (modalText) => {
    let modal = new Modal(
      {
      text: modalText, 
      type: 'alert',
      appState: this.appState
      }
    )
    this.body.append(modal.render())
    console.log(this.body)
    modal.okBtn.focus()
  }

  signInHandler = () => {
    eventEmiter.emit('AUTORIZATION')
  }
  
  render = () => {
    this.body.innerHTML = ""
    this.container = document.createElement('div')
    this.container.classList.add('todo-list', 'container')

    this.titleRow = document.createElement('div')
    this.titleRow.classList.add('row')

    this.title = document.createElement('h2')
    this.title.classList.add('todo-list__title', 'mb-3', 'mt-3', 'col', 'text-center')
    this.title.textContent = 'TO-DO LIST'

    this.addTaskUiRow = document.createElement('div')
    this.addTaskUiRow.classList.add('todo__input-container', 'mb-3', 'row', 'offset-sm-2')

    this.addTaskUiInputCol = document.createElement('div')
    this.addTaskUiInputCol.classList.add('col-12', 'col-sm-8', 'gx-0')

    this.input = document.createElement('input')
    this.input.className = 'todo-list__add-task-input'
    this.input.placeholder = 'Add Task'

    this.addTaskUiAddBtnCol = document.createElement('div')
    this.addTaskUiAddBtnCol.classList.add('col-12', 'col-sm-2', 'gy-sm-0', 'gy-1', 'gx-0')

    this.addBtn = document.createElement('button')
    this.addBtn.textContent = 'ADD'
    this.addBtn.classList.add('todo-list__add-task-btn')

    this.ulRow = document.createElement('div')
    this.ulRow.classList.add('todo-list__ul-container', 'row', 'offset-sm-2')

    this.ul = document.createElement('ul')
    this.ul.classList.add('todo-list__ul', 'col-sm-10', 'col-12')

    this.btnClrAllRow = document.createElement('div')
    this.btnClrAllRow.classList.add('row', 'offset-sm-2')

    this.btnClrAllCol = document.createElement('div')
    this.btnClrAllCol.classList.add('col-sm-10', 'col-12', 'gx-0', 'bg-white', 'd-flex', 'justify-content-end')

    this.btnClrAll = document.createElement('button')
    this.btnClrAll.classList.add('todo-list__clear-all-btn')
    this.btnClrAll.textContent = 'Clear'

    this.signInBtn = document.createElement('button')
    this.signInBtn.classList.add('todo-list__sign-in-btn')
    this.signInBtn.textContent = 'Sign in'
    
    this.container.append(this.titleRow)
    this.titleRow.append(this.title)
    this.container.append(this.addTaskUiRow)
    this.addTaskUiRow.append(this.addTaskUiInputCol)
    this.addTaskUiInputCol.append(this.input)
    this.addTaskUiRow.append(this.addTaskUiAddBtnCol)
    this.addTaskUiAddBtnCol.append(this.addBtn)
    this.container.append(this.ulRow)
    this.ulRow.append(this.ul)
    this.container.append(this.btnClrAllRow)
    this.btnClrAllRow.append(this.btnClrAllCol)
    this.btnClrAllCol.append(this.btnClrAll)
    this.container.append(this.signInBtn) 
    
    this.input.addEventListener('keypress', (e) => {
      if(e.key === 'Enter') {
        e.preventDefault()
        e.target.blur()
        this.addTodo()
      }      
    })

    this.addBtn.addEventListener('click', this.addTodo)

    this.signInBtn.addEventListener('click', this.signInHandler)

    this.btnClrAll.addEventListener('click', (e) => {
      if(this.appState.currentTasks.length < 1) {
        e.target.blur()
        this.openModalAlert('Todo list is already empty!')
      } else {
        e.target.blur()
        this.openModalConfirm()
      }
    })

    this.appState.currentTasks.forEach(t => {
      let todo = new ToDo(t)
      this.ul.append(todo.render())
    })

    return this.container
  }
}

const store = new STORE()
const app = new ROOT()
app.render('form')