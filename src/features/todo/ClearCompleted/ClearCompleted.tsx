import React from "react";
import { Button, message, Popconfirm } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useTodosQuery } from "@shared/hooks/useTodosQuery";

interface ClearCompletedTodoProps {
	stats: { total: number; active: number; completed: number };
}

export const ClearCompleted: React.FC<ClearCompletedTodoProps> = ({
	stats,
}) => {
	const { t } = useTranslation();
	const [messageApi, contextHolder] = message.useMessage();
	const { clearCompleted } = useTodosQuery();

	if (stats.completed === 0) return null;

	const handleClear = async () => {
		await clearCompleted();
		messageApi.success(t("clear.success", { count: stats.completed }));
	};

	return (
		<>
			{contextHolder}
			<Popconfirm
				title={t("clear.button", { count: stats.completed })}
				description={t("clear.confirm", { count: stats.completed })}
				onConfirm={handleClear}
				okText={t("confirm.yes")}
				cancelText={t("confirm.no")}
			>
				<Button
					danger
					icon={<DeleteOutlined />}
					type="dashed"
					style={{ marginTop: 16 }}
				>
					{t("clear.button", { count: stats.completed })}
				</Button>
			</Popconfirm>
		</>
	);
};
