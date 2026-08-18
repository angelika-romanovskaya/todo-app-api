import React from "react";
import { ITodo } from "../model/types";
import { TodoItem } from "./TodoItem";
import { EmptyState } from "./EmptyState";
import { useTheme } from "@app/providers/ThemeProvider";

interface TodoListProps {
	todos: ITodo[];
}

export const TodoList: React.FC<TodoListProps> = ({ todos }) => {
	const { isDark } = useTheme();

	if (todos.length === 0) {
		return <EmptyState />;
	}

	return (
		<div
			style={{
				background: isDark ? "#141414" : "#ffffff",
				borderRadius: "8px",
				overflow: "hidden",
			}}
		>
			{todos.map((todo) => (
				<TodoItem key={todo.id} todo={todo} />
			))}
		</div>
	);
};
