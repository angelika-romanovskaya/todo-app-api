import { createSlice } from "@reduxjs/toolkit";
import { login, register, logout } from "./thunks";
import { STORAGE_KEYS } from "@shared/config/constants";
import { AuthState } from "./types";

const initialState: AuthState = {
	token: localStorage.getItem(STORAGE_KEYS.TOKEN),
	user: null,
	loading: false,
	error: null,
};

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(login.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(login.fulfilled, (state, action) => {
				state.loading = false;
				state.token = action.payload.token;
				state.user = action.payload.username;
			})
			.addCase(login.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload ?? "Ошибка входа";
			})

			.addCase(register.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(register.fulfilled, (state, action) => {
				state.loading = false;
				state.token = action.payload.token;
				state.user = action.payload.username;
			})
			.addCase(register.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload ?? "Ошибка регистрации";
			})

			.addCase(logout.fulfilled, (state) => {
				state.token = null;
				state.user = null;
				state.error = null;
			});
	},
});

export const authReducer = authSlice.reducer;
