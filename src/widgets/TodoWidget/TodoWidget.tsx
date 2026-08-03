import React, { useState } from "react";
import { Card, Typography, Space, Divider, Tag, Button } from "antd";
import { UnorderedListOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { useTodos } from "@entities/Todo/model/hooks";
import { TodoList } from "@entities/Todo/ui/TodoList";
import { AddTodo } from "@features/todo/AddTodo";
import { FilterTodos } from "@features/todo/FilterTodos";
import { ClearCompleted } from "@features/todo/ClearCompleted";
import { ThemeToggle } from "@features/ThemeToggle";
import { useTranslation } from "react-i18next";
import "./TodoWidget.css";
import { FilterType } from "@entities/Todo/model/types";
import { LogoutButton } from "@features/auth/LogoutButton/LogoutButton";

const { Title } = Typography;

export const TodoWidget: React.FC = () => {
	const { t, i18n } = useTranslation();
	const toggleLanguage = () => {
		const newLang = i18n.language === "en" ? "ru" : "en";
		i18n.changeLanguage(newLang);
	};
	const [filter, setFilter] = useState<FilterType>("all");
	const {
		filteredTodos,
		stats,
		loading,
		error,
		addTodo,
		toggleTodo,
		editTodo,
		deleteTodo,
		clearCompleted,
	} = useTodos(filter);

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

			<AddTodo onAdd={addTodo} />
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
				<TodoList
					todos={filteredTodos}
					onEdit={editTodo}
					onToggle={toggleTodo}
					onDelete={deleteTodo}
				/>
			</div>

			<Divider style={{ margin: "0 0 16px 0" }} />
			<ClearCompleted stats={stats} onClearCompleted={clearCompleted}/>
		</Card>
	);
};
