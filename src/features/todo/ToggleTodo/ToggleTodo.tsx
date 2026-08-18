import React from "react";
import { Checkbox } from "antd";
import { ITodo } from "@entities/Todo/model/types";
import { useTodosQuery } from "@shared/hooks/useTodosQuery";

interface ToggleTodoProps {
	todo: ITodo;
}

export const ToggleTodo: React.FC<ToggleTodoProps> = ({ todo }) => {
	const { toggleTodo } = useTodosQuery();

	return (
		<Checkbox
			checked={todo.completed}
			onChange={() => toggleTodo(todo.id)}
			aria-label={`Mark "${todo.title}" as ${todo.completed ? "incomplete" : "complete"}`}
		/>
	);
};
