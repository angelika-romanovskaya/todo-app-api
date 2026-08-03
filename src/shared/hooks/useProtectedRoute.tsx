import { Navigate } from "react-router-dom";
import { useAuth } from "./useAuth";
import { Card, Spin } from "antd";
import "./useProtectedRoute.css";

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const { isAuthenticated, isLoading } = useAuth();

	if (isLoading) {
		return (
			<div className="auth-gate-overlay">
				<Card className="auth-gate-card" variant="borderless">
					<Spin size="large" />
				</Card>
			</div>
		);
	}
	return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};
