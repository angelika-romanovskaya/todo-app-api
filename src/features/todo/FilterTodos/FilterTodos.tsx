import React from "react";
import { Segmented } from "antd";
import {
	AppstoreOutlined,
	CheckSquareOutlined,
	ClockCircleOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "@app/hooks";
import { selectFilter, setFilter } from "@entities/Todo/model";
import { FilterType } from "@shared/config/constants";

export const FilterTodos: React.FC = () => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();
	const value = useAppSelector(selectFilter);

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
			onChange={(next) => dispatch(setFilter(next as FilterType))}
			block
			size="large"
			style={{ marginBottom: "24px" }}
		/>
	);
};
