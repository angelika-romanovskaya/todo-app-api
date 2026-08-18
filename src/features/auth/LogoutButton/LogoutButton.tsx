import React from "react";
import { Button } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "@app/providers";

export const LogoutButton: React.FC = () => {
	const { logout } = useAuth();
	const navigate = useNavigate();
	const { t } = useTranslation();

	const handleLogout = () => {
		logout();
		navigate("/login");
	};

	return (
		<Button
			icon={<LogoutOutlined />}
			onClick={handleLogout}
			aria-label={t("auth.logout")}
		>
			{t("auth.logout")}
		</Button>
	);
};
