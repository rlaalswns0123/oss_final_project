const host = "http://52.22.56.220:8000";
const todosContainer = document.querySelector('.todos-container');

// todosContainer가 null인지 확인하는 코드 추가
if (!todosContainer) {
    console.error("todosContainer 요소를 찾을 수 없습니다.");
}

function getTodos() {
    axios.get(`${host}/todo`)
        .then(response => {
            console.log(response.data);
            renderTodos(response.data.todos);
        })
        .catch(error => {
            console.error('Error fetching todos: ', error);
        });
}

function renderTodos(todos) {
    if (!todosContainer) return; // todosContainer가 null인 경우 함수 종료
    todosContainer.innerHTML = ''; // todosContainer 초기화
    todos.forEach(todo => {
        const todoDiv = document.createElement('div');
        todoDiv.classList.add('todo-item');
        todoDiv.innerHTML = `
            <p>Name: ${todo.name}</p>
            <p>Email: ${todo.email}</p>
            <p>Message: ${todo.message}</p>
             <p>Datetime: ${new Date(todo.datetime).toLocaleString()}</p>
            <button class="delete-btn" data-id="${todo.name}">Delete</button>
        `;
        todosContainer.appendChild(todoDiv);
    });

    attachDeleteHandlers();
}

function attachDeleteHandlers() {
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', async (event) => {
            const entryId = event.target.getAttribute('data-id');
            try {   
                await axios.delete(`${host}/todo/${entryId}`);
                getTodos();
            } catch (error) {
                console.error("Error deleting entry:", error);
            }
        });
    });
}

window.addEventListener('DOMContentLoaded', function () {
    getTodos();
});

const todoName = document.querySelector('#name');
const todoEmail = document.querySelector('#email');
const todoMessage = document.querySelector('#message');

// todoName, todoEmail, todoMessage가 null인지 확인하는 코드 추가
if (!todoName || !todoEmail || !todoMessage) {
    console.error("Form 요소를 찾을 수 없습니다.");
}

function addTodo() {
    const name = todoName ? todoName.value.trim() : '';
    const email = todoEmail ? todoEmail.value.trim() : '';
    const message = todoMessage ? todoMessage.value.trim() : '';
    if (!name || !email || !message) return;

    const todoData = { name, email, message, datetime: new Date().toISOString()};

    axios.post(`${host}/todo`, todoData)
        .then(response => {
            if (todoName) todoName.value = '';
            if (todoEmail) todoEmail.value = '';
            if (todoMessage) todoMessage.value = '';
            getTodos();
        })
        .catch(error => {
            console.error('Error adding todo:', error);
        });
}

if (todoName) {
    todoName.addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {
            addTodo();
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('guestbook-form');
    const entriesContainer = document.getElementById('guestbook-entries');

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        addTodo();
    });

    getTodos();
});
