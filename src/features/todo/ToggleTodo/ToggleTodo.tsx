import React from "react";
import { Checkbox } from "antd";
import { ITodo } from "@entities/Todo/model/types";

interface ToggleTodoProps {
	todo: ITodo;
	onToggle: (id: number) => void;
}

export const ToggleTodo: React.FC<ToggleTodoProps> = ({ todo, onToggle }) => {
	return (
		<Checkbox
			checked={todo.completed}
			onChange={() => onToggle(todo.id)}
			aria-label={`Mark "${todo.title}" as ${todo.completed ? "incomplete" : "complete"}`}
		/>
	);
};
