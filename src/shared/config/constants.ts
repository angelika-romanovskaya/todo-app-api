export type FilterType = "all" | "active" | "completed";

export const FILTER_TYPES: { value: FilterType; label: string }[] = [
	{ value: "all", label: "Все" },
	{ value: "active", label: "Активные" },
	{ value: "completed", label: "Выполненные" },
];

export const STORAGE_KEYS = {
	TODOS: "todo-app-todos",
	FILTER: "todo-app-filter",
	TOKEN: "todo-app-token",
} as const;
