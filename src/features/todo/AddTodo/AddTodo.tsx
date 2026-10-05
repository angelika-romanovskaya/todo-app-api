import React, { useState } from "react";
import { Input, Button, Space, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "@app/hooks";
import { createTodo } from "@entities/Todo/model";

export const AddTodo: React.FC = () => {
	const [text, setText] = useState("");
	const [messageApi, contextHolder] = message.useMessage();
	const { t } = useTranslation();

	const dispatch = useAppDispatch();
	const loading = useAppSelector((s) => s.todos.loading);

	const handleSubmit = async () => {
		if (!text.trim()) {
			messageApi.warning(t("add.warning"));
			return;
		}

		const result = await dispatch(
			createTodo({ title: text.trim(), description: "" }),
		);

		if (createTodo.fulfilled.match(result)) {
			setText("");
			messageApi.success(t("add.success"));
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") handleSubmit();
	};

	return (
		<>
			{contextHolder}
			<Space.Compact style={{ width: "100%", marginBottom: "24px" }}>
				<Input
					placeholder={t("add.placeholder")}
					value={text}
					onChange={(e) => setText(e.target.value)}
					onKeyDown={handleKeyDown}
					size="large"
					aria-label="New task input"
					disabled={loading}
				/>
				<Button
					type="primary"
					icon={<PlusOutlined />}
					onClick={handleSubmit}
					size="large"
					loading={loading}
					disabled={loading || !text.trim()}
				>
					{t("add.button")}
				</Button>
			</Space.Compact>
		</>
	);
};
