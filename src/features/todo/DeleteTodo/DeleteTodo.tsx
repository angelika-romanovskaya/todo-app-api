import React from "react";
import { Button, Popconfirm } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "@app/hooks";
import { deleteTodo } from "@entities/Todo/model";

interface DeleteTodoProps {
	todoId: number;
}

export const DeleteTodo: React.FC<DeleteTodoProps> = ({ todoId }) => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();
	const loading = useAppSelector((s) => s.todos.loading);

	const handleConfirm = async () => {
		await dispatch(deleteTodo(todoId));
	};

	return (
		<Popconfirm
			title={t("delete.aria")}
			description={t("delete.confirm")}
			onConfirm={handleConfirm}
			okText={t("confirm.yes")}
			cancelText={t("confirm.no")}
			okButtonProps={{ loading }}
		>
			<Button
				type="text"
				danger
				icon={<DeleteOutlined />}
				aria-label="Delete task"
				disabled={loading}
			/>
		</Popconfirm>
	);
};
