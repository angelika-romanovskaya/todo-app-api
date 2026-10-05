import React from "react";
import { Button, message, Popconfirm } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "@app/hooks";
import { selectStats } from "@entities/Todo/model";
import { clearCompleted } from "@entities/Todo/model";

export const ClearCompleted: React.FC = () => {
	const { t } = useTranslation();
	const [messageApi, contextHolder] = message.useMessage();

	const dispatch = useAppDispatch();
	const stats = useAppSelector(selectStats);
	const loading = useAppSelector((s) => s.todos.loading);

	if (stats.completed === 0) return null;

	const handleClear = async () => {
		const count = stats.completed;

		const result = await dispatch(clearCompleted());

		if (clearCompleted.fulfilled.match(result)) {
			messageApi.success(t("clear.success", { count }));
		}
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
				okButtonProps={{ loading }}
			>
				<Button
					danger
					icon={<DeleteOutlined />}
					type="dashed"
					style={{ marginTop: 16 }}
					loading={loading}
					disabled={loading}
				>
					{t("clear.button", { count: stats.completed })}
				</Button>
			</Popconfirm>
		</>
	);
};
