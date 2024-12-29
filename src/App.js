import { useEffect, useState } from 'react';
import styles from './App.module.css';

export const App = () => {
	const [todos, setTodos] = useState([]);

	useEffect(() => {
		fetch('https://jsonplaceholder.typicode.com/todos')
			.then((loadedData) => loadedData.json())
			.then((loadedTodos) => {
				setTodos(loadedTodos);
			});
	}, []);

	return (
		<div className={styles.app}>
			<p className={styles.title}>Todo list:</p>
			<ol>
				{todos.map(({ id, title }) => (
					<li className={styles.li} key={id}>
						{title}
					</li>
				))}
			</ol>
		</div>
	);
};
