import React from "react";
import { Card, Typography } from "antd";
import { useTranslation } from "react-i18next";
import "./AuthWidget.css";

const { Title } = Typography;

interface AuthWidgetProps {
	titleKey: string;
	children: React.ReactNode;
}

export const AuthWidget: React.FC<AuthWidgetProps> = ({
	titleKey,
	children,
}) => {
	const { t } = useTranslation();

	return (
		<div className="auth-container">
			<Card className="auth-card" variant="borderless">
				<Title level={2} style={{ textAlign: "center", marginBottom: 24 }}>
					{t(titleKey)}
				</Title>
				{children}
			</Card>
		</div>
	);
};
