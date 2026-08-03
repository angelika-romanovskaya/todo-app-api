import { useState, useEffect, useCallback } from "react";
import { todosApi, ITodoResponse } from "@shared/api/todosApi";
import { ITodo } from "@entities/Todo/model/types";

const mapTodo = (t: ITodoResponse): ITodo => ({
	id: t.id,
	title: t.title,
	description: t.description,
	completed: t.completed,
});

export const useTasksApi = () => {
	const [todos, setTodos] = useState<ITodo[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchTodos = useCallback(async () => {
		setLoading(true);
		try {
			const data = await todosApi.getAll();
			setTodos(data.map(mapTodo));
			setError(null);
		} catch (e) {
			setError("Ошибка загрузки задач");
		} finally {
			setLoading(false);
		}
	}, []);

	const addTodo = async (text: string) => {
		const newTodo = await todosApi.create(text);
		setTodos((prev) => [mapTodo(newTodo), ...prev]);
	};

	const toggleTodo = async (id: number) => {
		const todo = todos.find((t) => t.id === id);
		if (!todo) return;
		const updated = await todosApi.toggleCompleted(id);
		setTodos((prev) => prev.map((t) => (t.id === id ? mapTodo(updated) : t)));
	};

	const editTodo = async (id: number, newText: string) => {
		const updated = await todosApi.update(id, newText);
		setTodos((prev) => prev.map((t) => (t.id === id ? mapTodo(updated) : t)));
	};

	const deleteTodo = async (id: number) => {
		await todosApi.delete(id);
		setTodos((prev) => prev.filter((t) => t.id !== id));
	};

	const clearCompleted = async () => {
		const completedIds = todos.filter((t) => t.completed).map((t) => t.id);
		await Promise.all(completedIds.map((id) => todosApi.delete(id)));
		setTodos((prev) => prev.filter((t) => !t.completed));
	};

	useEffect(() => {
		fetchTodos();
	}, [fetchTodos]);

	return {
		todos,
		loading,
		error,
		addTodo,
		toggleTodo,
		editTodo,
		deleteTodo,
		clearCompleted,
		fetchTodos,
	};
};
