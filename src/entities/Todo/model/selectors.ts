import { RootState } from "@app/store";
import { createSelector } from "@reduxjs/toolkit";

export const selectTodos = (state: RootState) => state.todos.items || [];
export const selectTodosLoading = (state: RootState) => state.todos.loading;
export const selectTodosError = (state: RootState) => state.todos.error;
export const selectFilter = (state: RootState) => state.filter.value;

export const selectFilteredTodos = createSelector(
	[selectTodos, selectFilter],
	(todos, filter) => {
		switch (filter) {
			case "active":
				return todos.filter((t) => !t.isCompleted);
			case "completed":
				return todos.filter((t) => t.isCompleted);
			default:
				return todos;
		}
	},
);

export const selectStats = createSelector([selectTodos], (todos) => {
	return {
		total: todos.length,
		active: todos.filter((t) => !t.isCompleted).length || 0,
		completed: todos.filter((t) => t.isCompleted).length || 0,
	};
});
