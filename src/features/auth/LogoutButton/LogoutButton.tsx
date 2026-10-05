import React, { useEffect } from "react";
import { Button } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "@app/hooks";
import { logout } from "@entities/User/model";

export const LogoutButton: React.FC = () => {
	const dispatch = useAppDispatch();
	const token = useAppSelector((s) => s.auth.token);
	const navigate = useNavigate();
	const { t } = useTranslation();

	useEffect(() => {
		if (!token) navigate("/login", { replace: true });
	}, [token, navigate]);

	const handleLogout = () => {
		dispatch(logout());
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
