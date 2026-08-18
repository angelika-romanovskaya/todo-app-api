import React from "react";
import { Button, Popconfirm } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useTodosQuery } from "@shared/hooks/useTodosQuery";

interface DeleteTodoProps {
	todoId: number;
}

export const DeleteTodo: React.FC<DeleteTodoProps> = ({ todoId }) => {
	const { t } = useTranslation();
	const { deleteTodo } = useTodosQuery();

	return (
		<Popconfirm
			title={t("delete.aria")}
			description={t("delete.confirm")}
			onConfirm={() => deleteTodo(todoId)}
			okText={t("confirm.yes")}
			cancelText={t("confirm.no")}
		>
			<Button
				type="text"
				danger
				icon={<DeleteOutlined />}
				aria-label="Delete task"
			/>
		</Popconfirm>
	);
};
