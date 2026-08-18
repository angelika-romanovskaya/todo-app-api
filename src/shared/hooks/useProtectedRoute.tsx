import React from "react";
import { Navigate } from "react-router-dom";
import { Spin } from "antd";
import { useAuth } from "@app/providers";

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const { isAuthenticated, isLoading } = useAuth();

	if (isLoading) {
		return (
			<div
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					height: "100vh",
				}}
			>
				<Spin size="large" />
			</div>
		);
	}

	return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};
