import React, { useEffect, useRef, useState } from "react";
import { Button, Space, Typography, Input, type InputRef } from "antd";
import { EditOutlined, CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "@app/hooks";
import { useTheme } from "@app/providers/ThemeProvider";
import { ITodo, updateTodoText } from "../model";
import { ToggleTodo } from "@features/todo/ToggleTodo";
import { DeleteTodo } from "@features/todo/DeleteTodo";

const { Text } = Typography;

interface TodoItemProps {
	todo: ITodo;
}

export const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
	const dispatch = useAppDispatch();
	const loading = useAppSelector((s) => s.todos.loading);
	const { isDark } = useTheme();

	const [isEditing, setIsEditing] = useState(false);
	const [editText, setEditText] = useState(todo.title);
	const inputRef = useRef<InputRef>(null);

	useEffect(() => {
		if (isEditing && inputRef.current) {
			inputRef.current.focus();
		}
	}, [isEditing]);

	useEffect(() => {
		if (!isEditing) setEditText(todo.title);
	}, [todo.title, isEditing]);

	const handleEdit = () => {
		setEditText(todo.title);
		setIsEditing(true);
	};

	const handleSave = async () => {
		const nextTitle = editText.trim();
		if (!nextTitle || nextTitle === todo.title) {
			setIsEditing(false);
			return;
		}

		const result = await dispatch(
			updateTodoText({
				id: todo.id,
				title: nextTitle,
				description: todo.description,
			}),
		);

		if (updateTodoText.fulfilled.match(result)) {
			setIsEditing(false);
		}
	};

	const handleCancel = () => {
		setEditText(todo.title);
		setIsEditing(false);
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") handleSave();
		else if (e.key === "Escape") handleCancel();
	};

	return (
		<div
			style={{
				display: "flex",
				alignItems: "center",
				justifyContent: "space-between",
				padding: "12px 16px",
				borderBottom: `1px solid ${isDark ? "#303030" : "#f0f0f0"}`,
				opacity: todo.isCompleted ? 0.7 : 1,
				transition: "all 0.3s",
			}}
		>
			<div
				style={{
					display: "flex",
					flex: 1,
					alignItems: "center",
					gap: 8,
					minWidth: 0,
				}}
			>
				<ToggleTodo todo={todo} />

				{isEditing ? (
					<div
						style={{ display: "flex", flex: 1, gap: 8, alignItems: "center" }}
					>
						<Input
							ref={inputRef}
							value={editText}
							style={{ flex: 1 }}
							onChange={(e) => setEditText(e.target.value)}
							onKeyDown={handleKeyDown}
							disabled={loading}
						/>
						<Button
							icon={<CheckOutlined />}
							onClick={handleSave}
							type="primary"
							size="small"
							loading={loading}
							disabled={loading}
						/>
						<Button
							icon={<CloseOutlined />}
							onClick={handleCancel}
							size="small"
							disabled={loading}
						/>
					</div>
				) : (
					<Text
						delete={todo.isCompleted}
						style={{
							cursor: "pointer",
							fontSize: "16px",
							textDecoration: todo.isCompleted ? "line-through" : "none",
							color: isDark ? "#ffffff" : "#000000",
						}}
						onDoubleClick={handleEdit}
					>
						{todo.title}
					</Text>
				)}
			</div>

			<Space>
				<Button
					type="text"
					icon={<EditOutlined />}
					onClick={handleEdit}
					aria-label="Edit task"
					disabled={loading || isEditing}
				/>
				<DeleteTodo todoId={todo.id} />
			</Space>
		</div>
	);
};
