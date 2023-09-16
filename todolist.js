const todoList = document.getElementById('todo-list');
const newTodoInput = document.getElementById('new-todo');
const newDescriptionInput = document.getElementById('new-description'); // Added description input
const addTodoButton = document.getElementById('add-todo');
const completedList = document.getElementById('completed-list');

addTodoButton.addEventListener('click', () => {
    const todoText = newTodoInput.value.trim();
    const todoDescription = newDescriptionInput.value.trim(); // Get the description
    if (todoText !== '') {
        createTodoItem(todoText, todoDescription); // Pass description to createTodoItem
        newTodoInput.value = '';
        newDescriptionInput.value = ''; // Clear the description input
    }
});

function createTodoItem(todoText, todoDescription) {
    const todoItem = document.createElement('div');
    todoItem.className = 'todo-item';
    todoItem.innerHTML = `
        <span><strong>Todo:</strong> ${todoText}</span>
        <span><strong>Description:</strong> ${todoDescription}</span>
        <span class="todo-actions">
            <button class="mark-done">✅</button>
            <button class="delete">❌</button>
        </span>`;

    todoList.appendChild(todoItem);

    const markDoneButton = todoItem.querySelector('.mark-done');
    markDoneButton.addEventListener('click', () => {
        moveTodoToDoneList(todoItem, todoText, todoDescription); // Pass description to moveTodoToDoneList
    });

    const deleteButton = todoItem.querySelector('.delete');
    deleteButton.addEventListener('click', () => {
        deleteTodoItem(todoItem, todoText, todoDescription); // Pass description to deleteTodoItem
    });
}

// Define your API endpoint (replace with your actual "crud crud" API URL)
const apiEndpoint = 'https://crudcrud.com/api/7655e53db0854fc485294c58a25891d0';

function moveTodoToDoneList(todoItem, todoText, todoDescription) {
    // Create a new object with the todo text and description
    const todoData = { text: todoText, description: todoDescription };

    // Make a POST request to the API to add the todo to "todosdone"
    fetch(apiEndpoint + '/todosdone', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(todoData),
    })
        .then(response => {
            if (response.ok) {
                // If the POST request was successful, remove the todoItem from the current list
                todoList.removeChild(todoItem);

                // Add the completed todo to the completed list
                addCompletedTodoToScreen(todoText, todoDescription); // Pass description to addCompletedTodoToScreen
            } else {
                // Handle any errors that may occur during the POST request
                console.error('Failed to move todo to done list.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function addCompletedTodoToScreen(todoText, todoDescription) {
    const completedTodoItem = document.createElement('div');
    completedTodoItem.className = 'completed-todo-item';
    completedTodoItem.innerHTML = `
        <span><strong>Todo:</strong> ${todoText}</span>
        <span><strong>Description:</strong> ${todoDescription}</span>`;
        
    completedList.appendChild(completedTodoItem);
}

function deleteTodoItem(todoItem, todoText, todoDescription) {
    // Make a GET request to the API to retrieve the item's ID
    fetch(apiEndpoint + '/todosdone?text=' + encodeURIComponent(todoText), {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Failed to retrieve item ID.');
            }
        })
        .then(data => {
            const itemId = data[0]._id; // Assuming the API returns the ID in this format

            // Make a DELETE request using the retrieved item ID
            fetch(apiEndpoint + '/todosdone/' + itemId, {
                method: 'DELETE',
            })
                .then(deleteResponse => {
                    if (deleteResponse.ok) {
                        // If the DELETE request was successful, remove the todoItem from the current list
                        todoList.removeChild(todoItem);
                    } else {
                        // Handle any errors that may occur during the DELETE request
                        console.error('Failed to delete todo.');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        })
        .catch(error => {
            console.error('Error:', error);
        });
}