export interface ITodo {
	id: number;
	title: string;
	description: string;
	completed: boolean;
}

export type FilterType = "all" | "active" | "completed";

export interface TodoState {
	todos: ITodo[];
	filter: FilterType;
}
