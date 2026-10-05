import { createSlice } from "@reduxjs/toolkit";
import {
	fetchTodos,
	createTodo,
	updateTodoText,
	toggleTodoStatus,
	deleteTodo,
	clearCompleted,
} from "./thunks";
import type { TodosState } from "./types";

const initialState: TodosState = {
	items: [],
	loading: false,
	error: null,
};

const todoSlice = createSlice({
	name: "todos",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchTodos.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchTodos.fulfilled, (state, action) => {
				state.loading = false;
				state.items = action.payload;
			})
			.addCase(fetchTodos.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload ?? "Не удалось загрузить задачи";
			})

			.addCase(createTodo.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(createTodo.fulfilled, (state, action) => {
				state.loading = false;
				state.items.unshift(action.payload);
			})
			.addCase(createTodo.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload ?? "Не удалось создать задачу";
			})

			.addCase(updateTodoText.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(updateTodoText.fulfilled, (state, action) => {
				state.loading = false;
				const idx = state.items.findIndex((t) => t.id === action.payload.id);
				if (idx !== -1) state.items[idx] = action.payload;
			})
			.addCase(updateTodoText.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload ?? "Не удалось обновить задачу";
			})

			.addCase(toggleTodoStatus.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(toggleTodoStatus.fulfilled, (state, action) => {
				state.loading = false;
				const idx = state.items.findIndex((t) => t.id === action.payload.id);
				if (idx !== -1) state.items[idx] = action.payload;
			})
			.addCase(toggleTodoStatus.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload ?? "Не удалось изменить статус";
			})

			.addCase(deleteTodo.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(deleteTodo.fulfilled, (state, action) => {
				state.loading = false;
				state.items = state.items.filter((t) => t.id !== action.payload);
			})
			.addCase(deleteTodo.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload ?? "Не удалось удалить задачу";
			})

			.addCase(clearCompleted.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(clearCompleted.fulfilled, (state, action) => {
				state.loading = false;
				const removed = new Set(action.payload);
				state.items = state.items.filter((t) => !removed.has(t.id));
			})
			.addCase(clearCompleted.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload ?? "Не удалось очистить выполненные";
			});
	},
});

export const todoReducer = todoSlice.reducer;
