import { FilterType } from "@shared/config/constants";

export interface ITodo {
	id: number;
	title: string;
	description: string;
	isCompleted: boolean;
	createdAt?: string;
	updatedAt?: string;
}

export interface TodosState {
	items: ITodo[];
	loading: boolean;
	error: string | null;
}

export interface FilterState {
	value: FilterType;
}
