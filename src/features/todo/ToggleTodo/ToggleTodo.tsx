import React from "react";
import { Checkbox } from "antd";
import { useAppDispatch, useAppSelector } from "@app/hooks";
import { ITodo, toggleTodoStatus } from "@entities/Todo/model";

interface ToggleTodoProps {
	todo: ITodo;
}

export const ToggleTodo: React.FC<ToggleTodoProps> = ({ todo }) => {
	const dispatch = useAppDispatch();
	const loading = useAppSelector((s) => s.todos.loading);

	const handleChange = () => {
		dispatch(
			toggleTodoStatus({
				id: todo.id,
				isCompleted: !todo.isCompleted,
			}),
		);
	};

	return (
		<Checkbox
			checked={todo.isCompleted}
			onChange={handleChange}
			disabled={loading}
			aria-label={`Mark "${todo.title}" as ${
				todo.isCompleted ? "incomplete" : "complete"
			}`}
		/>
	);
};
