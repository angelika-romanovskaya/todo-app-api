import React, { useMemo, useState } from "react";
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
import { TodoList } from "@entities/Todo/ui/TodoList";
import { AddTodo } from "@features/todo/AddTodo";
import { FilterTodos } from "@features/todo/FilterTodos";
import { ClearCompleted } from "@features/todo/ClearCompleted";
import { ThemeToggle } from "@features/ThemeToggle";
import { useTranslation } from "react-i18next";
import "./TodoWidget.css";
import { FilterType } from "@entities/Todo/model/types";
import { LogoutButton } from "@features/auth/LogoutButton/LogoutButton";
import { useTodosQuery } from "@shared/hooks/useTodosQuery";

const { Title } = Typography;

export const TodoWidget: React.FC = () => {
	const { t, i18n } = useTranslation();
	const toggleLanguage = () => {
		const newLang = i18n.language === "en" ? "ru" : "en";
		i18n.changeLanguage(newLang);
	};
	const [filter, setFilter] = useState<FilterType>("all");
	const { todos, isLoading, error } = useTodosQuery();

	const filteredTodos = useMemo(() => {
		switch (filter) {
			case "active":
				return todos.filter((t) => !t.completed);
			case "completed":
				return todos.filter((t) => t.completed);
			default:
				return todos;
		}
	}, [todos, filter]);

	const stats = useMemo(
		() => ({
			total: todos.length,
			active: todos.filter((t) => !t.completed).length,
			completed: todos.filter((t) => t.completed).length,
		}),
		[todos],
	);

	if (isLoading)
		return (
			<Spin size="large" style={{ display: "block", margin: "100px auto" }} />
		);
	if (error)
		return (
			<Result
				status="error"
				title={t("common.error")}
				subTitle={error.message}
			/>
		);

	return (
		<Card
			variant="borderless"
			className="todo-widget-card"
			style={{
				height: "100%",
				display: "flex",
				flexDirection: "column",
			}}
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
			<FilterTodos onChange={setFilter} value={filter} />

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
				<TodoList todos={filteredTodos} />
			</div>

			<Divider style={{ margin: "0 0 16px 0" }} />
			<ClearCompleted stats={stats} />
		</Card>
	);
};
