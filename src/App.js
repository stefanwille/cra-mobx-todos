import React, { useState, createContext, useContext } from 'react';
import './App.css';

import { configure, observable, action, computed, decorate } from 'mobx';
import { observer } from 'mobx-react';

configure({ enforceActions: 'observed' });

const StoreContext = createContext();

const useStore = () => useContext(StoreContext);

const AddTodo = () => {
    const store = useStore();
    const [ text, setText ] = useState('New todo');
    const handleTextChange = (event) => {
        setText(event.target.value);
    };
    const submitTodo = () => {
        store.addTodo(text);
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
    const store = useStore();
    const handleDeleteClick = () => {
        store.deleteTodo(index);
    };
    return (
        <button className="delete-button" onClick={handleDeleteClick}>
            X
        </button>
    );
};

const NumberOfTodos = observer(() => {
    const store = useStore();
    return <h5>You have {store.todoCount} Todos</h5>;
});

const ListOfTodos = observer(() => {
    const store = useStore();
    return (
        <ol>
            {store.todos.map((todo, index) => (
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

class TodoStore {
    todos = [ 'Buy milk', 'Write book' ];

    get todoCount() {
        return this.todos.length;
    }

    addTodo(todo) {
        this.todos.push(todo);
    }

    deleteTodo(index) {
        this.todos.splice(index, 1);
    }
}

decorate(TodoStore, {
    todos: observable,
    todoCount: computed,
    addTodo: action,
    deleteTodo: action
});

const store = new TodoStore();

const App = () => {
    return (
        <StoreContext.Provider value={store}>
            <div className="App">
                <TodoList />
            </div>
        </StoreContext.Provider>
    );
};

export default App;
