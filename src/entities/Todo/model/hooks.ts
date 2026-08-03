import { useTasksApi } from "@shared/hooks/useTasksApi";
import { useMemo } from "react";
import { FILTER_TYPES } from "@shared/config/constants";
import type { FilterType } from "./types";

export const useTodos = (filter: FilterType) => {
	const {
		todos,
		loading,
		error,
		addTodo,
		toggleTodo,
		editTodo,
		deleteTodo,
		clearCompleted,
	} = useTasksApi();

	const filteredTodos = useMemo(() => {
		switch (filter) {
			case FILTER_TYPES.ACTIVE:
				return todos.filter((t) => !t.completed);
			case FILTER_TYPES.COMPLETED:
				return todos.filter((t) => t.completed);
			default:
				return todos;
		}
	}, [todos, filter]);

	const stats = useMemo(
		() => ({
			total: todos.length,
			active: todos.filter((t) => !t.completed).length,
			completed: todos.filter((t) => t.completed).length,
		}),
		[todos],
	);

	return {
		filteredTodos,
		stats,
		loading,
		error,
		addTodo,
		toggleTodo,
		editTodo,
		deleteTodo,
		clearCompleted,
	};
};
