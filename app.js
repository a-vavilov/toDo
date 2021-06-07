// UI ELEMENTS
const todo__taskList = document.querySelector('.todo__taskList')
const todo__taskInput = document.querySelector('.todo__taskInput')
const todo__btnAddTask = document.querySelector('.todo__btnAdd')
const todo__btnClrAll = document.querySelector('.todo__btnClrAll')


// RESERVED VARIABLES
let clickDelay


const tasks = [
    {
    task:'My task',
    id: 'task-id',
    done: true,
    }
]

renderAllTasks(tasks)


// EVENT LISTENERS
todo__taskInput.addEventListener('keypress', taskInputKeypressHandler)

todo__btnAddTask.addEventListener('click', btnAddTaskHandler)

todo__btnClrAll.addEventListener('click', btnClrAllHandler)

todo__taskList.addEventListener('click', taskListClickHandler)

todo__taskList.addEventListener('dblclick', taskListDoublebClickHandler)

todo__taskList.addEventListener('focusout', taskListFocusoutHandler)

// FUNCTIONS
function renderAllTasks(tasks) {
    let fragment = document.createDocumentFragment()
    tasks.forEach((task) => {
        const li = listItemCreate(task)
        fragment.append(li)
    });
    todo__taskList.append(fragment)
}

function btnAddTaskHandler(e) {
    if(!todo__taskInput.value) {
        return
    }

    const taskValue = todo__taskInput.value

    const task = createNewTask(taskValue)
    todo__taskList.append(listItemCreate(task))
    todo__taskInput.value = ''
}

function taskInputKeypressHandler(e) {
    if(e.which === 13) {
        e.preventDefault()

        if(!todo__taskInput.value) {
            return
        }

        const taskValue = todo__taskInput.value

        const task = createNewTask(taskValue)
        todo__taskList.append(listItemCreate(task))
        todo__taskInput.value = ''
    }
}

function taskEditKeypressHandler (e) {
    if(e.which === 13) {
        todo__taskInput.focus()
    }
}

function listItemCreate({ task, id, done }) {
    const li = document.createElement('li')
    li.setAttribute('data-task-id', id)
    li.classList.add('taskItem')


    const btn = document.createElement('button')
    btn.classList.add('todo__btnDeleteTask')
    btn.textContent = 'X'

    const checkbox = document.createElement('input')
    checkbox.setAttribute('type', 'checkbox')
    if(done) {
        checkbox.setAttribute('checked', '')
    }
    checkbox.classList.add('taskCheckbox')

    const span = document.createElement('span')
    span.classList.add('taskText')
    span.textContent = task

    if(done) {
        checkbox.setAttribute('checked', '')
        span.classList.toggle('taskDone')
    }


    li.append(btn)
    li.append(checkbox)
    li.append(span)

    return li
}

function taskListClickHandler({ target }){
    const closestParent = target.closest('[data-task-id]')
    const identificator = closestParent.dataset.taskId
    
    if(clickDelay) clearTimeout(clickDelay)
    
    // checkboxClick
    if(target.classList.contains('taskCheckbox')) {
        if(target.checked) {
            target.nextElementSibling.classList.toggle('taskDone')
            tasks.forEach(task => {
                if(task.id === identificator) {
                    index = tasks.indexOf(task, 0)
                    task.done = true
                } 
            })
    
        } else {
            target.nextElementSibling.classList.toggle('taskDone')

            tasks.forEach(task => {
                if(task.id === identificator) {
                    index = tasks.indexOf(task, 0)
                    task.done = false
                } 
            })
        }
    }
    
    //dltBtnClick
    if(target.classList.contains('todo__btnDeleteTask')) {
        closestParent.remove()
        
        tasks.forEach(task => {
            if(task.id === identificator) {
                index = tasks.indexOf(task, 0)
                tasks.splice(index, 1)
            } 
        })
    }
    
    //taskTextClick
    clickDelay = setTimeout(() => {
        if(target.classList.contains('taskText')) {
            if(target.previousElementSibling.checked) {
                target.classList.toggle('taskDone')
                target.previousElementSibling.checked = false
                
                tasks.forEach(task => {
                    if(task.id === identificator) {
                        index = tasks.indexOf(task, 0)
                        task.done = false
                    } 
                })
    
            } else {
                target.classList.toggle('taskDone')
                target.previousElementSibling.checked = true
                
                tasks.forEach(task => {
                    if(task.id === identificator) {
                        index = tasks.indexOf(task, 0)
                        task.done = true
                    } 
                })
    
            }
        }
    }, 180)
}

function taskListDoublebClickHandler(e) {
    const closestParent = e.target.closest('[data-task-id]')
    const identificator = closestParent.dataset.taskId

    if(e.target.classList.contains('taskText')) {
        clearTimeout(clickDelay)
        e.target.setAttribute('contenteditable', 'true')  
        e.target.focus()
    }
    if(document.activeElement.classList.contains('taskText')) {
        todo__taskList.removeEventListener('click', taskListClickHandler)
        todo__taskList.addEventListener('keypress', taskEditKeypressHandler)
    }


}

function modalAlertClickHandler(e) {
    if(e.target.classList.contains('modal') || e.target.classList.contains('modal__ok-btn')) {
        closeModal(e)
    }
}

function modalConfirmClickHandler(e) {
    if(e.target.classList.contains('modal__ok-btn')) {
        todo__taskList.innerHTML = ''
        closeModal(e)
    } else if(e.target.classList.contains('modal__cancel-btn') || e.target.classList.contains('modal')) {
        closeModal(e)
    }
}   

function createNewTask(todo, id) {
    let newTask = {
        task: todo,
        id: `task-${id || Math.random().toFixed(9)}`,
        done: false,
    }
    tasks.push(newTask)
    return { ...newTask }
}

function btnClrAllHandler(e) {
    if(todo__taskList.children.length < 1) {
        modalAlert('Task list is already empty!')
        return
    }
    modalConfirm('Are you sure, that you want to clear the task list?') 
    tasks.splice(0, tasks.length)
}

function taskListFocusoutHandler(e) {
    const closestParent = e.target.closest('[data-task-id]')
    const identificator = closestParent.dataset.taskId

    e.target.setAttribute('contenteditable', 'false')

    tasks.forEach(task => {
        if(task.id === identificator) {
            index = tasks.indexOf(task, 0)
            task.task = e.target.textContent
        } 
    })

    todo__taskList.addEventListener('click', taskListClickHandler)
    todo__taskList.removeEventListener('keypress', taskEditKeypressHandler)
}

function modalAlert(text) {
    let modal = document.querySelector('.modal.modal__alert')
    let modalText = document.querySelector('.modal__text')

    modalText.textContent = text
    modal.style.visibility = 'visible'

    modal.addEventListener('click', modalAlertClickHandler)
}

function modalConfirm(text) {
    let modal = document.querySelector('.modal.modal__confirm')
    let okBtn = document.querySelector('.modal__ok-btn')
    let cancelBtn = document.querySelector('.modal__cancel-btn')
    let modalText = document.querySelector('.modal__text')


    modalText.textContent = text

    modal.style.visibility = 'visible'

    modal.addEventListener('click', modalConfirmClickHandler)
    
    okBtn.addEventListener('click', modalConfirmClickHandler)
    cancelBtn.addEventListener('click', closeModal)
}

function closeModal(e) {
    let modalAlert = document.querySelector('.modal.modal__alert')
    let modalConfirm = document.querySelector('.modal.modal__confirm')
    let cancelBtn = document.querySelector('.modal__cancel-btn')
    let okBtn = document.querySelector('.modal__cancel-btn')

    modalAlert.style.visibility = 'hidden'
    modalConfirm.style.visibility = 'hidden'

    modalConfirm.removeEventListener('click', modalConfirmClickHandler)
    modalAlert.removeEventListener('click', modalAlertClickHandler)
}