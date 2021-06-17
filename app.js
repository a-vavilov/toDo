const appState = {
  currentRoute: null,
  currentTasks: null,
  isModalOpen: null,
}

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
    console.log(this.events)
    const event = this.events[someEvent]
    if(event) {
      event.forEach(func => {
        func(data)
      })
    }
  }
}

class Routing {
  constructor(props) {
    this.body = document.body
    this.currentRoute = 'form'
    this.appState = appState
    this.appStateEventEmitter = new EventEmitter
  }
  goTo = (newRoute, data) => {
    this.currentRoute = newRoute
    this.render(data)
  }

  saveToAppState = (data) => {
    this.appStateEventEmitter.on('setRoute', (data) => {
      this.appState.currentRoute = data
    })
    this.appStateEventEmitter.emit('setRoute', data)
  }

  render = (data) => {
    switch(this.currentRoute) {
      case 'form':
      const form = (new FormLogin({ goTo: this.goTo })).render()
      this.body.append(form)
      this.saveToAppState(this.currentRoute)
      break
      case 'toDo':
      const toDo = (new ToDoList({ goTo: this.goTo, tasks: data, appState: this.appState })).render()
      this.body.append(toDo)
      this.saveToAppState(this.currentRoute)
      break
    }
  }
}

class FormLogin {
  constructor(props) {
    this.body = document.body
    this.goTo = props.goTo
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
      this.goTo('toDo',)
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
    this.submitBtn.classList.add('btn', 'form-login__btn-submit')

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
    this.appState = props.appState
    this.appStateEventEmitter = new EventEmitter
    this.okBtnHandler = props.okBtnHandler
  }

  close = (e) => {
    this.modal.remove()
    this.saveToAppState(false)
  }

  okClose = () => {
    if(this.okBtnHandler) {
      this.okBtnHandler()
    }
    this.close()
    this.saveToAppState(false)
  }

  saveToAppState = (data) => {
    this.appStateEventEmitter.on('isModalOpen', (data) => {
      this.appState.isModalOpen = data
    })
    this.appStateEventEmitter.emit('isModalOpen', data)
  }

  render = () => {
    if(this.type === 'confirm'){
      this.modal = document.createElement('div')
      this.modal.classList.add('modal', 'modal__confirm')
  
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
      this.okBtn.addEventListener('click', this.okClose)

      this.saveToAppState(true)
      
      return this.modal

    } else if(this.type === 'alert') {
      this.modal = document.createElement('div')
      this.modal.classList.add('modal', 'modal__confirm')
  
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
  
      this.okBtn.addEventListener('click', this.okClose)

      this.saveToAppState(true)

      return this.modal
    }
  }
}

class ToDo {
  constructor(props) {
    this.text = props.text
    this.isComplited = props.isComplited
    this.removeTodo = props.removeTodo
    this.isCompleteTodo = props.isCompleteTodo
    this.isNotCompletedTodo = props.isNotCompletedTodo
    this.editTodo = props.editTodo
    this.id = props.id
  }

  todoRemove = () => {
    this.removeTodo(this.id)
  }

  todoIsComplete = (e) => {
    const closestParent = e.target.closest('[data-task-id]')
    const identificator = closestParent.dataset.taskId

    if(this.clickDelay) {
      clearTimeout(this.clickDelay)
    }

    this.clickDelay = setTimeout(() => {
      if(e.target.classList.contains('todo-list__task-done') || e.target.hasAttribute('checked')) {
        this.isCompleteTodo(+identificator)  
      } else {
        this.isNotCompletedTodo(+identificator)  
      }
    }, 180)

  }

  todoEdit = (e) => {
    clearTimeout(this.clickDelay)
    e.target  .setAttribute('contenteditable', 'true')  
    e.target.focus()
  }

  focusOutTaskHandler = (e) => {
    const closestParent = e.target.closest('[data-task-id]')
    const identificator = closestParent.dataset.taskId

    this.editTodo(+identificator, e)
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
    this.goTo = props.goTo
    this.appState = props.appState
    this.appStateEventEmitter = new EventEmitter
    this.tasks = props.tasks || []
  }

  addTodo = () => {
    if(this.input.value === '' || this.input.value === false) {
      this.openModalAlert('There is nothing to add!')
      return
    }

    let todo = new ToDo(
      { 
        removeTodo:this.removeTodo,
        isCompleteTodo: this.isCompleteTodo, 
        isNotCompletedTodo: this.isNotCompletedTodo, 
        editTodo: this.editTodo, 
        text:this.input.value, 
        id: Math.random()
      }
    )
    this.tasks.push(todo)
    console.log(this.tasks)
    this.render()
    this.input.focus()
  }

  removeTodo = (id) => {
    this.tasks = this.tasks.filter(task => task.id !== id)

    this.render()
  }

  isCompleteTodo = (id) => {
    this.tasks.forEach(task => {
      if(task.id === id) {
        task.isComplited = false
      }
    })
    this.render()
  }

  isNotCompletedTodo = (id) => {
    this.tasks.forEach(task => {
      if(task.id === id) {
        task.isComplited = true
      }
    })
    this.render()
  }

  editTodo = (id, e) => {
    e.target.blur()
    this.tasks.forEach(task => {
      if(task.id === id) {
        task.text = e.target.textContent
      }
    })
    this.render()
  }

  clearTodoList = (e) => {
    this.tasks = []

    this.render()
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
    modal.okBtn.focus()
  }

  signInHandler = () => {
    this.body.innerHTML = ''
    this.goTo('form')
  }

  saveToAppState = (data) => {
    this.appStateEventEmitter.on('setTasks', (data) => {
      this.appState.currentTasks = data
    })
    this.appStateEventEmitter.emit('setTasks', data)
  }

  
  render = () => {
    this.body.innerHTML = ""
    this.container = document.createElement('div')
    this.container.classList.add('todo-list')

    this.title = document.createElement('h2')
    this.title.classList.add('todo-list__title')
    this.title.textContent = 'TO-DO LIST'

    this.ulContainer = document.createElement('div')
    this.ulContainer.classList.add('todo-list__ul-container')

    this.ul = document.createElement('ul')
    this.ul.classList.add('todo-list__ul')
    
    this.btnClrAll = document.createElement('button')
    this.btnClrAll.classList.add('todo-list__clear-all-btn')
    this.btnClrAll.textContent = 'Clear'

    this.input = document.createElement('input')
    this.input.className = 'todo-list__add-task-input'
    this.input.autofocus = true
    this.input.placeholder = 'Add Task'

    this.addBtn = document.createElement('button')
    this.addBtn.textContent = 'ADD'
    this.addBtn.classList.add('todo-list__add-task-btn')

    this.signInBtn = document.createElement('button')
    this.signInBtn.classList.add('todo-list__sign-in-btn')
    this.signInBtn.textContent = 'Sign in'
    
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
      if(this.tasks.length < 1) {
        e.target.blur()
        this.openModalAlert('Todo list is already empty!')
      } else {
        e.target.blur()
        this.openModalConfirm()
      }
    })
    
    this.container.append(this.title)
    this.container.append(this.input)
    this.container.append(this.addBtn)
    this.container.append(this.ulContainer)
    this.container.append(this.signInBtn)
    this.ulContainer.append(this.ul)
    this.ulContainer.append(this.btnClrAll)

    this.tasks.forEach(t => {
      console.log(t)
      let todo = new ToDo(t)
      this.ul.append(todo.render())
    })

    
    this.body.append(this.container)

    this.goTo('todo', this.tasks)

    this.saveToAppState(this.tasks)

    return this.container
  }
}

const routing = (new Routing()).render()