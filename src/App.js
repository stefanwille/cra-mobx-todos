import React, { useState, createContext, useContext } from 'react';
import './App.css';

import { configure, observable, action } from 'mobx';
import { observer } from 'mobx-react';

configure({ enforceActions: 'observed' });

const StoreContext = createContext();

const AddTodo = () => {
	const store = useContext(StoreContext);
	const [ todo, setTodo ] = useState('Neu');
	const handleChange = (event) => {
		setTodo(event.target.value);
	};
	const handleKeyPress = (event) => {
		if (event.key === 'Enter') {
			store.addTodo(todo);
		}
	};
	return (
		<div>
			<input type="text" value={todo} onChange={handleChange} onKeyPress={handleKeyPress} />
		</div>
	);
};

const DeleteButton = ({ index }) => {
	const store = useContext(StoreContext);
	const deleteTodo = store.deleteTodo;
	const handleDeleteClick = () => {
		deleteTodo(index);
	};
	return <button onClick={handleDeleteClick}>X</button>;
};

const NumberOfTodos = () => <h5>{store.todoCount} Todos</h5>;

const TodoList = observer(() => {
	const store = useContext(StoreContext);
	return (
		<div>
			<ol>
				{store.todos.map((todo, index) => (
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

const store = observable(
	{
		todos: [ 'Buy milk', 'Write book' ],
		get todoCount() {
			return this.todos.length;
		},
		addTodo(todo) {
			this.todos.push(todo);
		},
		deleteTodo(index) {
			const newTodos = deleteFromArray(this.todos, index);
			this.todos = newTodos;
		}
	},
	{
		addTodo: action.bound,
		deleteTodo: action.bound
	}
);

function App() {
	return (
		<StoreContext.Provider value={store}>
			<div className="App">
				<a href="https://reactjs.org">Learn React</a>

				<TodoList />
			</div>
		</StoreContext.Provider>
	);
}

export default App;
