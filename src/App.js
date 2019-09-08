import React, { useState, createContext, useContext } from 'react';
import './App.css';

import { configure, observable, action } from 'mobx';
import { observer } from 'mobx-react';

configure({ enforceActions: 'observed' });

const StoreContext = createContext();

const useStore = () => useContext(StoreContext);
const useTodoStore = () => useStore().todoStore;

const AddTodo = () => {
    const todoStore = useTodoStore();
    const [ text, setText ] = useState('New todo');
    const handleTextChange = (event) => {
        setText(event.target.value);
    };
    const submitTodo = () => {
        todoStore.addTodo(text);
    };
    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            submitTodo();
        }
    };
    return (
        <div>
            <input type="text" value={text} onChange={handleTextChange} onKeyPress={handleKeyPress} />{' '}
            <button onClick={submitTodo}>OK</button>
        </div>
    );
};

const DeleteButton = ({ index }) => {
    const todoStore = useTodoStore();
    const handleDeleteClick = () => {
        todoStore.delete(index);
    };
    return (
        <button className="delete-button" onClick={handleDeleteClick}>
            X
        </button>
    );
};

const NumberOfTodos = observer(() => {
    const todoStore = useTodoStore();
    return <h5>You have {todoStore.todoCount} Todos</h5>;
});

const ListOfTodos = observer(() => {
    const todoStore = useTodoStore();
    return (
        <ol>
            {todoStore.todos.map((todo, index) => (
                <li key={index} className="todo">
                    {todo} <DeleteButton index={index} />
                </li>
            ))}
        </ol>
    );
});

const TodoList = () => {
    return (
        <div>
            <ListOfTodos />
            <NumberOfTodos />
            <AddTodo />
        </div>
    );
};

const todoStore = observable(
    {
        todos: [ 'Buy milk', 'Write book' ],
        get todoCount() {
            return this.todos.length;
        },

        addTodo(todo) {
            this.todos.push(todo);
        },

        delete(index) {
            this.todos.splice(index, 1);
        }
    },
    {
        addTodo: action,
        delete: action
    }
);

const stores = {
    todoStore
};

function App() {
    return (
        <StoreContext.Provider value={stores}>
            <div className="App">
                <TodoList />
            </div>
        </StoreContext.Provider>
    );
}

export default App;
