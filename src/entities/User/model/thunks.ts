import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiRequest } from "@shared/api/httpClient";
import { STORAGE_KEYS } from "@shared/config/constants";

export interface Credentials {
	username: string;
	password: string;
}

interface AuthResponse {
	access_token: string;
}

export const login = createAsyncThunk<
	{ token: string; username: string },
	Credentials,
	{ rejectValue: string }
>("auth/login", async (credentials, { rejectWithValue }) => {
	try {
		const { access_token } = await apiRequest<AuthResponse>("/auth/login", {
			method: "POST",
			body: credentials,
		});
		localStorage.setItem(STORAGE_KEYS.TOKEN, access_token);
		return { token: access_token, username: credentials.username };
	} catch (e) {
		return rejectWithValue((e as Error).message);
	}
});

export const register = createAsyncThunk<
	{ token: string; username: string },
	Credentials,
	{ rejectValue: string }
>("auth/register", async (credentials, { rejectWithValue }) => {
	try {
		const { access_token } = await apiRequest<AuthResponse>("/auth/register", {
			method: "POST",
			body: credentials,
		});
		localStorage.setItem(STORAGE_KEYS.TOKEN, access_token);
		return { token: access_token, username: credentials.username };
	} catch (e) {
		return rejectWithValue((e as Error).message);
	}
});

export const logout = createAsyncThunk("auth/logout", async () => {
	localStorage.removeItem(STORAGE_KEYS.TOKEN);
});
