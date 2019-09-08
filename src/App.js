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
	const [ todo, setTodo ] = useState('Neu');
	const handleChange = (event) => {
		setTodo(event.target.value);
	};
	const submitTodo = () => {
		todoStore.addTodo(todo);
	};
	const handleKeyPress = (event) => {
		if (event.key === 'Enter') {
			submitTodo();
		}
	};
	return (
		<div>
			<input type="text" value={todo} onChange={handleChange} onKeyPress={handleKeyPress} />{' '}
			<button onClick={submitTodo}>OK</button>
		</div>
	);
};

const DeleteButton = ({ index }) => {
	const todoStore = useTodoStore();
	const handleDeleteClick = () => {
		todoStore.delete(index);
	};
	return <button onClick={handleDeleteClick}>X</button>;
};

const NumberOfTodos = () => {
	const todoStore = useTodoStore();
	return <h5>{todoStore.todoCount} Todos</h5>;
};

const TodoList = observer(() => {
	const todoStore = useTodoStore();
	return (
		<div>
			<ol>
				{todoStore.todos.map((todo, index) => (
					<li key={index}>
						{todo} <DeleteButton index={index} />
					</li>
				))}
			</ol>
			<NumberOfTodos />
			<AddTodo />
		</div>
	);
});

const deleteFromArray = (array, index) => array.slice(0, index).concat(array.slice(index + 1));

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
			const newTodos = deleteFromArray(this.todos, index);
			this.todos = newTodos;
		}
	},
	{
		addTodo: action.bound,
		delete: action.bound
	}
);

const stores = {
	todoStore
};

function App() {
	return (
		<StoreContext.Provider value={stores}>
			<div className="App">
				<a href="https://reactjs.org">Learn React</a>

				<TodoList />
			</div>
		</StoreContext.Provider>
	);
}

export default App;
