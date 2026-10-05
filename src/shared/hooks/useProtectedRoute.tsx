import React from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "@app/hooks";

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const token = useAppSelector((state) => state.auth.token);

	return token ? <>{children}</> : <Navigate to="/login" replace />;
};
