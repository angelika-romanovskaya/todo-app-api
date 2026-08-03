import httpClient from "./httpClient";

interface AuthResponse {
	access_token: string;
}

export const authApi = {
	login: async (email: string, password: string): Promise<string> => {
		const { data } = await httpClient.post<AuthResponse>("/auth/login", {
			email,
			password,
		});
		return data.access_token;
	},

	register: async (
		email: string,
		password: string,
		name: string,
	): Promise<string> => {
		const { data } = await httpClient.post<AuthResponse>("/auth/register", {
			email,
			password,
			name,
		});
		return data.access_token;
	},
};
