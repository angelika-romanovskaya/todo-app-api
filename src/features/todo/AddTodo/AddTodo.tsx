import React, { useState } from "react";
import { Input, Button, Space, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

interface AddTodoProps {
	onAdd: (text: string) => Promise<void>;
}

export const AddTodo: React.FC<AddTodoProps> = ({ onAdd }) => {
	const [text, setText] = useState("");
	const [messageApi, contextHolder] = message.useMessage();
	const { t } = useTranslation();

	const handleSubmit = () => {
		if (!text.trim()) {
			messageApi.warning(t("add.warning"));
			return;
		}

		onAdd(text);
		setText("");
		messageApi.success(t("add.success"));
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") {
			handleSubmit();
		}
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
				/>
				<Button
					type="primary"
					icon={<PlusOutlined />}
					onClick={handleSubmit}
					size="large"
				>
					{t("add.button")}
				</Button>
			</Space.Compact>
		</>
	);
};
