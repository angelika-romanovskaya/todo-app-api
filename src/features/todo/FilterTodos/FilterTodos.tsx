import React from "react";
import { Segmented } from "antd";
import {
	AppstoreOutlined,
	CheckSquareOutlined,
	ClockCircleOutlined,
} from "@ant-design/icons";
import { FilterType } from "@entities/Todo/model/types";
import { useTranslation } from "react-i18next";

interface FilterTodosProps {
	value: FilterType;
	onChange: (value: FilterType) => void;
}

export const FilterTodos: React.FC<FilterTodosProps> = ({
	onChange,
	value,
}) => {
	const { t } = useTranslation();

	const options = [
		{
			label: t("filter.all"),
			value: "all" as FilterType,
			icon: <AppstoreOutlined />,
		},
		{
			label: t("filter.active"),
			value: "active" as FilterType,
			icon: <ClockCircleOutlined />,
		},
		{
			label: t("filter.completed"),
			value: "completed" as FilterType,
			icon: <CheckSquareOutlined />,
		},
	];

	return (
		<Segmented
			options={options}
			value={value}
			onChange={onChange}
			block
			size="large"
			style={{ marginBottom: "24px" }}
		/>
	);
};
