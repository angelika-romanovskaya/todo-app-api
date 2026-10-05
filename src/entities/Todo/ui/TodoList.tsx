import React from "react";
import { useAppSelector } from "@app/hooks";
import { selectFilteredTodos } from "../model/selectors";
import { TodoItem } from "./TodoItem";
import { EmptyState } from "./EmptyState";
import { useTheme } from "@app/providers/ThemeProvider";

export const TodoList: React.FC = () => {
	const todos = useAppSelector(selectFilteredTodos);
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
