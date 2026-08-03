import React, { useState } from "react";
import { Form, Input, Button, Alert, message } from "antd";
import { MailOutlined, LockOutlined, UserOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "@shared/api/authApi";
import { setToken } from "@shared/lib/tokenStorage";
import { useAuth } from "@shared/hooks/useAuth";
import { useTranslation } from "react-i18next";
import { LocalStorageService } from "@shared/lib/localStorage";

export const RegisterForm: React.FC = () => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const { login } = useAuth();
	const navigate = useNavigate();
	const { t } = useTranslation();
	const [messageApi, contextHolder] = message.useMessage();

	const onFinish = async (values: {
		email: string;
		password: string;
		name: string;
	}) => {
		setLoading(true);
		setError(null);
		try {
			const token = await authApi.register(
				values.email,
				values.password,
				values.name,
			);
			setToken(token);
			LocalStorageService.set("user", JSON.stringify(values));
			login({ ...values });
			messageApi.success(t("auth.successRegister"));
			navigate("/");
		} catch (e: any) {
			setError(e?.response?.data?.message || t("auth.registerError"));
		} finally {
			setLoading(false);
		}
	};

	return (
		<div>
			{contextHolder}
			{error && (
				<Alert
					message={error}
					type="error"
					style={{ marginBottom: 16 }}
					showIcon
				/>
			)}
			<Form onFinish={onFinish} layout="vertical" size="large">
				<Form.Item
					name="name"
					rules={[{ required: true, message: t("auth.enterName") }]}
				>
					<Input prefix={<UserOutlined />} placeholder={t("auth.name")} />
				</Form.Item>
				<Form.Item
					name="email"
					rules={[
						{
							required: true,
							type: "email",
							message: t("auth.enterValidEmail"),
						},
					]}
				>
					<Input prefix={<MailOutlined />} placeholder="Email" />
				</Form.Item>
				<Form.Item
					name="password"
					rules={[
						{ required: true, min: 6, message: t("auth.passwordMinLength") },
					]}
				>
					<Input.Password
						prefix={<LockOutlined />}
						placeholder={t("auth.password")}
					/>
				</Form.Item>
				<Form.Item>
					<Button type="primary" htmlType="submit" loading={loading} block>
						{t("auth.registerButton")}
					</Button>
				</Form.Item>
			</Form>
			<div style={{ textAlign: "center" }}>
				{t("auth.haveAccount")} <Link to="/login">{t("auth.login")}</Link>
			</div>
		</div>
	);
};
