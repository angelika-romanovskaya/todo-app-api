import React from "react";
import { Button, Popconfirm } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

interface DeleteTodoProps {
	todoId: number;
	onDelete: (id: number) => void;
}

export const DeleteTodo: React.FC<DeleteTodoProps> = ({ todoId, onDelete }) => {
	const { t } = useTranslation();

	return (
		<Popconfirm
			title={t("delete.aria")}
			description={t("delete.confirm")}
			onConfirm={() => onDelete(todoId)}
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
