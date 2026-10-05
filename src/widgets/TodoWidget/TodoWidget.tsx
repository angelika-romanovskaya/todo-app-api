import React, { useEffect } from "react";
import {
	Card,
	Typography,
	Space,
	Divider,
	Tag,
	Button,
	Spin,
	Result,
} from "antd";
import { UnorderedListOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "@app/hooks";
import "./TodoWidget.css";
import { fetchTodos, selectStats, selectTodosError, selectTodosLoading } from "@entities/Todo/model";
import { ThemeToggle } from "@features/ThemeToggle";
import { LogoutButton } from "@features/auth/LogoutButton/LogoutButton";
import { AddTodo } from "@features/todo/AddTodo";
import { FilterTodos } from "@features/todo/FilterTodos";
import { TodoList } from "@entities/Todo/ui/TodoList";
import { ClearCompleted } from "@features/todo/ClearCompleted";

const { Title } = Typography;

export const TodoWidget: React.FC = () => {
	const { t, i18n } = useTranslation();
	const dispatch = useAppDispatch();

	const loading = useAppSelector(selectTodosLoading);
	const error = useAppSelector(selectTodosError);
	const stats = useAppSelector(selectStats);
	const token = useAppSelector((s) => s.auth.token);

	useEffect(() => {
		if (token) dispatch(fetchTodos());
	}, [dispatch, token]);

	const toggleLanguage = () => {
		i18n.changeLanguage(i18n.language === "en" ? "ru" : "en");
	};

	if (loading && stats.total === 0)
		return (
			<Spin size="large" style={{ display: "block", margin: "100px auto" }} />
		);

	if (error)
		return <Result status="error" title={t("common.error")} subTitle={error} />;

	return (
		<Card
			variant="borderless"
			className="todo-widget-card"
			style={{ height: "100%", display: "flex", flexDirection: "column" }}
			styles={{
				body: {
					flex: 1,
					display: "flex",
					flexDirection: "column",
					overflow: "hidden",
				},
			}}
		>
			<div
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					marginBottom: 24,
				}}
			>
				<Title level={2} style={{ margin: 0 }}>
					<UnorderedListOutlined /> {t("app.title")}
				</Title>
				<Space>
					<ThemeToggle />
					<Button onClick={toggleLanguage}>
						{i18n.language === "en" ? "🇷🇺" : "🇬🇧"}
					</Button>
					<LogoutButton />
				</Space>
			</div>

			<AddTodo />
			<FilterTodos />

			<Space style={{ marginBottom: "16px" }}>
				<Tag icon={<UnorderedListOutlined />} color="blue">
					{t("stats.total", { count: stats.total })}
				</Tag>
				<Tag icon={<UnorderedListOutlined />} color="orange">
					{t("stats.active", { count: stats.active })}
				</Tag>
				<Tag icon={<CheckCircleOutlined />} color="green">
					{t("stats.completed", { count: stats.completed })}
				</Tag>
			</Space>

			<div
				className="todo-scroll"
				style={{ flex: 1, overflowY: "auto", marginBottom: "16px" }}
			>
				<TodoList/>
			</div>

			<Divider style={{ margin: "0 0 16px 0" }} />
			<ClearCompleted />
		</Card>
	);
};
