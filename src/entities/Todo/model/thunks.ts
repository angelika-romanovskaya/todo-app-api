import { createAsyncThunk } from "@reduxjs/toolkit";
import type { ITodo } from "./types";
import { apiRequest } from "@shared/api/httpClient";
import { RootState } from "@app/store";

const getToken = (state: RootState) => state.auth.token;

interface TodosResponse {
	data: ITodo[];
	meta: {
		total: number;
		page: number;
		limit: number;
		totalPages: number;
	};
}

export const fetchTodos = createAsyncThunk<
	ITodo[],
	void,
	{ rejectValue: string; state: RootState }
>("todos/fetchTodos", async (_, { getState, rejectWithValue }) => {
	try {
		const response = await apiRequest<TodosResponse>("/todos", {
			token: getToken(getState()),
		});
		return response.data;
	} catch (e) {
		return rejectWithValue((e as Error).message);
	}
});

export const createTodo = createAsyncThunk<
	ITodo,
	{ title: string; description: string },
	{ rejectValue: string; state: RootState }
>("todos/createTodo", async (payload, { getState, rejectWithValue }) => {
	try {
		return await apiRequest<ITodo>("/todos", {
			method: "POST",
			body: payload,
			token: getToken(getState()),
		});
	} catch (e) {
		return rejectWithValue((e as Error).message);
	}
});

export const updateTodoText = createAsyncThunk<
	ITodo,
	{ id: number; title: string; description: string },
	{ rejectValue: string; state: RootState }
>(
	"todos/updateTodoText",
	async ({ id, title, description }, { getState, rejectWithValue }) => {
		try {
			return await apiRequest<ITodo>(`/todos/${id}`, {
				method: "PATCH",
				body: { title, description },
				token: getToken(getState()),
			});
		} catch (e) {
			return rejectWithValue((e as Error).message);
		}
	},
);

export const toggleTodoStatus = createAsyncThunk<
	ITodo,
	{ id: number; isCompleted: boolean },
	{ rejectValue: string; state: RootState }
>(
	"todos/toggleTodoStatus",
	async ({ id, isCompleted }, { getState, rejectWithValue }) => {
		try {
			return await apiRequest<ITodo>(`/todos/${id}`, {
				method: "PATCH",
				body: { isCompleted },
				token: getToken(getState()),
			});
		} catch (e) {
			return rejectWithValue((e as Error).message);
		}
	},
);

export const deleteTodo = createAsyncThunk<
	number,
	number,
	{ rejectValue: string; state: RootState }
>("todos/deleteTodo", async (id, { getState, rejectWithValue }) => {
	try {
		await apiRequest<void>(`/todos/${id}`, {
			method: "DELETE",
			token: getToken(getState()),
		});
		return id;
	} catch (e) {
		return rejectWithValue((e as Error).message);
	}
});

export const clearCompleted = createAsyncThunk<
	number[],
	void,
	{ rejectValue: string; state: RootState }
>("todos/clearCompleted", async (_, { getState, rejectWithValue }) => {
	const state = getState();
	const token = getToken(state);
	const completed = state.todos.items.filter((t) => t.isCompleted);

	if (completed.length === 0) return [];

	try {
		await Promise.all(
			completed.map((todo) =>
				apiRequest<void>(`/todos/${todo.id}`, {
					method: "DELETE",
					token,
				}),
			),
		);

		return completed.map((t) => t.id);
	} catch (e) {
		return rejectWithValue((e as Error).message);
	}
});
