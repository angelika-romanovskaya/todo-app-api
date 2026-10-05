import { filterReducer } from "@entities/Todo/model/filterSlice";
import { todoReducer } from "@entities/Todo/model/todoSlice";
import { authReducer } from "@entities/User/model/authSlice";
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
	reducer: {
		auth: authReducer,
		todos: todoReducer,
		filter: filterReducer,
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
