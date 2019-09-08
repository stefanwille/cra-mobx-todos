import React, { createContext, useContext } from 'react';
import './App.css';

import { configure, observable, action, computed, decorate } from 'mobx';
import { observer, useLocalStore } from 'mobx-react';

configure({ enforceActions: 'observed' });

const StoreContext = createContext();

const useStore = () => useContext(StoreContext);

const AddTodo = observer(() => {
    const store = useStore();
    const localStore = useLocalStore(() => ({
        text: 'New todo'
    }));
    const submitTodo = () => {
        store.addTodo(localStore.text);
        localStore.text = 'New todo';
    };

    return (
        <div>
            <input
                type="text"
                value={localStore.text}
                onChange={action((event) => {
                    localStore.text = event.target.value;
                })}
                onKeyPress={action((event) => {
                    if (event.key === 'Enter') {
                        submitTodo();
                    }
                })}
            />{' '}
            <button onClick={action(submitTodo)}>OK</button>
        </div>
    );
});

const DeleteButton = ({ index }) => {
    const store = useStore();
    return (
        <button
            className="delete-button"
            onClick={() => {
                store.deleteTodo(index);
            }}
        >
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
