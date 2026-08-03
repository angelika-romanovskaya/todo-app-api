import { LoginForm } from "@features/auth/LoginForm/LoginForm";
import { AuthWidget } from "@widgets/AuthWidget";
import React from "react";

export const LoginPage: React.FC = () => (
	<AuthWidget titleKey="auth.login">
		<LoginForm />
	</AuthWidget>
);
