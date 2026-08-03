import httpClient from "./httpClient";

export interface ITodoResponse {
	id: number;
	title: string;
	description: string;
	completed: boolean;
}

export const todosApi = {
	getAll: async (): Promise<ITodoResponse[]> => {
		const { data } = await httpClient.get<{ data: ITodoResponse[] }>("/todos");
		return data.data;
	},

	create: async (text: string): Promise<ITodoResponse> => {
		const { data } = await httpClient.post<ITodoResponse>("/todos", {
			title: text,
		});
		return data;
	},

	update: async (id: number, text: string): Promise<ITodoResponse> => {
		const { data } = await httpClient.patch<ITodoResponse>(`/todos/${id}`, {
			title: text,
		});
		return data;
	},

	toggleCompleted: async (id: number): Promise<ITodoResponse> => {
		const { data } = await httpClient.patch<ITodoResponse>(
			`/todos/${id}/toggle`,
		);
		return data;
	},

	delete: async (id: number): Promise<void> => {
		await httpClient.delete(`/todos/${id}`);
	},
};
