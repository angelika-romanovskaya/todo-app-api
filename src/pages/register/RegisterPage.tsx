import React from "react";
import { AuthWidget } from "@widgets/AuthWidget";
import { RegisterForm } from "@features/auth/RegisterForm/RegisterForm";

export const RegisterPage: React.FC = () => (
	<AuthWidget titleKey="auth.register">
		<RegisterForm />
	</AuthWidget>
);
