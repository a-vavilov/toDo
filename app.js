////////////////// TODO SCOPE START ////////////////////////////////////////////////////////////

{

////////////////// UI ELEMENTS /////////////////////////////////////////////////////////////////

const todo__taskList = document.querySelector('.todo__taskList')
const todo__taskInput = document.querySelector('.todo__taskInput')
const todo__btnAddTask = document.querySelector('.todo__btnAdd')
const todo__btnClrAll = document.querySelector('.todo__btnClrAll')

////////////////// RESERVED VARIABLES //////////////////////////////////////////////////////////

let clickDelay

////////////////// EVENT LISTENERS /////////////////////////////////////////////////////////////

todo__btnAddTask.addEventListener('click', btnAddTaskHandler)

todo__btnClrAll.addEventListener('click', btnClrAllHandler)

todo__taskList.addEventListener('click', taskListClickHandler)

todo__taskList.addEventListener('dblclick', taskListDoublebClickHandler)

todo__taskList.addEventListener('focusout', taskListFocusoutHandler)

////////////////// FUNCTIONS ///////////////////////////////////////////////////////////////////

function listItemCreate(task) {
    const li = document.createElement('li')
    li.classList.add('taskItem')


    const btn = document.createElement('button')
    btn.classList.add('todo__btnDeleteTask')
    btn.textContent = 'X'

    const checkbox = document.createElement('input')
    checkbox.setAttribute('type', 'checkbox')
    checkbox.classList.add('taskCheckbox')

    const span = document.createElement('span')
    span.classList.add('taskText')
    span.textContent = task

    li.append(btn)
    li.append(checkbox)
    li.append(span)

    return li
}

function taskListClickHandler({ target }){
    
    if(clickDelay) clearTimeout(clickDelay)
    
    if(target.classList.contains('taskCheckbox')) {
        if(target.checked) {
            target.nextElementSibling.classList.toggle('taskDone')
        } else target.nextElementSibling.classList.toggle('taskDone')
    }
    
    if(target.classList.contains('todo__btnDeleteTask')) {
        target.closest('.taskItem').remove()
    }
    
    clickDelay = setTimeout(() => {
        if(target.classList.contains('taskText')) {
            if(target.previousElementSibling.checked) {
                target.classList.toggle('taskDone')
                target.previousElementSibling.checked = false           
            } else {
                target.classList.toggle('taskDone')
                target.previousElementSibling.checked = true           
            }
        }
    }, 300)
}

function taskListDoublebClickHandler(e) {
    if(e.target.classList.contains('taskText')) {
        clearTimeout(clickDelay)
        e.target.setAttribute('contenteditable', 'true')  
        e.target.focus()
    }
    if(document.activeElement === e.target) {
        todo__taskList.removeEventListener('click', taskListClickHandler)
    }
}

function btnAddTaskHandler(e) {
    if(!todo__taskInput.value) return
    let task = todo__taskInput.value
    todo__taskList.append(listItemCreate(task))
    todo__taskInput.value = ''
}

function btnClrAllHandler(e) {
    if(todo__taskList.children.length < 1) return alert('Task list is already empty!')

    let agree = confirm('Are you sure, that you want to clear the task list?')
    if(agree) todo__taskList.innerHTML = ''
}

function taskListFocusoutHandler(e) {
    e.target.setAttribute('contenteditable', 'false')
    todo__taskList.addEventListener('click', taskListClickHandler)
}

}
////////////////// TODO SCOPE END //////////////////////////////////////////////////////////////