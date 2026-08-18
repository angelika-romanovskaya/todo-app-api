import React, { useState, useRef, useEffect } from "react";
import { Button, Space, Typography, Input } from "antd";
import { EditOutlined, CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { ITodo } from "../model/types";
import { ToggleTodo } from "@features/todo/ToggleTodo";
import { DeleteTodo } from "@features/todo/DeleteTodo";
import { useTheme } from "@app/providers/ThemeProvider";
import { useTodosQuery } from "@shared/hooks/useTodosQuery";

const { Text } = Typography;

interface TodoItemProps {
	todo: ITodo;
}

export const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
	const [isEditing, setIsEditing] = useState(false);
	const [editText, setEditText] = useState(todo.title);
	const inputRef = useRef<any>(null);
	const { isDark } = useTheme();
	const { editTodo } = useTodosQuery();

	useEffect(() => {
		if (isEditing && inputRef.current) {
			inputRef.current.focus();
		}
	}, [isEditing]);

	const handleEdit = () => {
		setIsEditing(true);
		setEditText(todo.title);
	};

	const handleSave = () => {
		if (editText.trim()) {
			editTodo({ id: todo.id, text: editText });
			setIsEditing(false);
		}
	};

	const handleCancel = () => {
		setIsEditing(false);
		setEditText(todo.title);
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") {
			handleSave();
		} else if (e.key === "Escape") {
			handleCancel();
		}
	};

	return (
		<div
			style={{
				display: "flex",
				alignItems: "center",
				justifyContent: "space-between",
				padding: "12px 16px",
				borderBottom: `1px solid ${isDark ? "#303030" : "#f0f0f0"}`,
				opacity: todo.completed ? 0.7 : 1,
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
						/>
						<Button
							icon={<CheckOutlined />}
							onClick={handleSave}
							type="primary"
							size="small"
						/>
						<Button
							icon={<CloseOutlined />}
							onClick={handleCancel}
							size="small"
						/>
					</div>
				) : (
					<Text
						delete={todo.completed}
						style={{
							cursor: "pointer",
							fontSize: "16px",
							textDecoration: todo.completed ? "line-through" : "none",
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
				/>
				<DeleteTodo todoId={todo.id} />
			</Space>
		</div>
	);
};
