import { useEffect, useState } from 'react';
import { ref, onValue, push, set, remove } from 'firebase/database';
import { db } from './firebase';
import styles from './App.module.css';

function debounce(func, wait) {
	let timeout;
	return function executedFunction(...args) {
		const later = () => {
			clearTimeout(timeout);
			func(...args);
		};
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
	};
}

export const FirebaseServer = () => {
	const [todos, setTodos] = useState({});
	const [refreshTodos, setRefreshTodos] = useState(false);
	const [isCreating, setIsCreating] = useState(false);
	const [isUpdating, setIsUpdating] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [isSorting, setIsSorting] = useState(false);
	const [inputValue, setInputValue] = useState('');
	const [searchQuery, setSearchQuery] = useState('');
	const [debouncedQuery, setDebouncedQuery] = useState('');

	useEffect(() => {
		const todosDbRef = ref(db, 'todos');
		onValue(todosDbRef, (snapshot) => {
			const data = snapshot.val();
			setTodos(data || {});
		});
	}, [refreshTodos]);

	const addElement = (event) => {
		event.preventDefault();

		setIsCreating(true);

		const todosDbRef = ref(db, 'todos');

		push(todosDbRef, {
			name: inputValue,
		})
			.then((response) => {
				console.log('Элемент добавлен. Ответ сервера:', response);
				setRefreshTodos(!refreshTodos);
				setInputValue('');
			})
			.catch((error) => {
				console.error('Ошибка добавления элемента:', error);
			})
			.finally(() => setIsCreating(false));
	};

	const updateElement = (idElement) => {
		setIsUpdating(true);

		const todosDbRef = ref(db, `todos/${idElement}`);

		set(todosDbRef, {
			name: 'Задача обновлена',
		})
			.then((response) => {
				console.log('Элемент обновлён. Ответ сервера:', response);
				setRefreshTodos(!refreshTodos);
			})
			.catch((error) => {
				console.error('Ошибка обновления элемента:', error);
			})
			.finally(() => setIsUpdating(false));
	};

	const deleteElement = (idElement) => {
		setIsDeleting(true);

		const todosDbRef = ref(db, `todos/${idElement}`);

		remove(todosDbRef)
			.then((response) => {
				console.log('Элемент удалён. Ответ сервера:', response);
				setRefreshTodos(!refreshTodos);
			})
			.finally(() => setIsDeleting(false));
	};

	const sortTodos = (todos) => {
		if (!todos) return {};
		return Object.fromEntries(Object.entries(todos).sort((a, b) => a[1].name.localeCompare(b[1].name)));
	};

	const filterTodos = (todos) => {
		if (!todos) return {};
		return Object.fromEntries(
			Object.entries(todos).filter(([id, todo]) =>
				todo.name.toLowerCase().includes(debouncedQuery.toLowerCase()),
			),
		);
	};

	const renderTodos = () => {
		if (!todos) {
			return null;
		}

		let listToRender = isSorting ? sortTodos(todos) : todos;
		listToRender = filterTodos(listToRender);

		return Object.entries(listToRender).map(([id, { name }]) => (
			<li className={styles.li} key={id}>
				<p className={styles.textTask}>{name}</p>
				<button className={styles.buttonUpdate} disabled={isUpdating} onClick={() => updateElement(id)}>
					Обновить
				</button>
				<button className={styles.buttonDelete} disabled={isDeleting} onClick={() => deleteElement(id)}>
					Удалить
				</button>
			</li>
		));
	};

	const debouncedHandleSearch = debounce((query) => {
		setDebouncedQuery(query);
	}, 300);

	useEffect(() => {
		debouncedHandleSearch(searchQuery);
	}, [searchQuery, debouncedHandleSearch]);

	return (
		<div className={styles.app}>
			<p className={styles.title}>Todo list:</p>
			<div className={styles.blockButtons}>
				<form onSubmit={addElement}>
					<div className={styles.blockAddTask}>
						<input
							type="text"
							value={inputValue}
							onChange={({ target }) => setInputValue(target.value)}
							className={styles.inputAddTask}
						/>
						<button type="submit" className={styles.buttonAddTask} disabled={isCreating}>
							Добавить задачу
						</button>
					</div>
				</form>
				<input
					type="text"
					placeholder="Поиск"
					className={styles.inputSearch}
					value={searchQuery}
					onChange={({ target }) => setSearchQuery(target.value)}
				/>
				<button
					className={styles.buttonSort}
					onClick={() => {
						setIsSorting(!isSorting);
					}}
				>
					{isSorting ? 'Отключить сортировку' : 'Сортировать по алфавиту'}
				</button>
			</div>
			<ol>{renderTodos()}</ol>
		</div>
	);
};
