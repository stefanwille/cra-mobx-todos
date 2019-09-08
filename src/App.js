import React, { createContext, useContext } from 'react';
import './App.css';

import { configure, observable, action, computed, decorate } from 'mobx';
import { observer, useLocalStore } from 'mobx-react';

configure({ enforceActions: 'observed' });

const StoreContext = createContext();

const useStore = () => useContext(StoreContext);

const AddTodo = () => {
    const store = useStore();
    const localStore = useLocalStore(() => ({
        text: 'New todo',
        setText(text) {
            this.text = text;
        }
    }));
    const submitTodo = () => {
        store.addTodo(localStore.text);
    };
    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            submitTodo();
        }
    };
    return (
        <div>
            <input
                type="text"
                value={localStore.text}
                onChange={action((event) => {
                    console.log('setting it', localStore.text);
                    localStore.setText(event.target.value);
                    console.log('after', localStore.text);
                })}
                onKeyPress={handleKeyPress}
            />{' '}
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

class Store {
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

decorate(Store, {
    todos: observable,
    todoCount: computed,
    addTodo: action,
    deleteTodo: action
});

const store = new Store();

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
