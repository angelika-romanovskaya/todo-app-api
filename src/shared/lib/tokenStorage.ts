import { LocalStorageService } from "./localStorage";

const TOKEN_KEY = "todo-auth-token";

export const getToken = (): string | null =>
	LocalStorageService.get(TOKEN_KEY, "");

export const setToken = (token: string) =>
	LocalStorageService.set(TOKEN_KEY, token);

export const removeToken = () => LocalStorageService.remove(TOKEN_KEY);
