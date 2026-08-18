import React, { useState } from "react";
import { Form, Input, Button, Alert, message } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "@shared/api/authApi";
import { setToken } from "@shared/lib/tokenStorage";
import { useTranslation } from "react-i18next";
import { LocalStorageService } from "@shared/lib/localStorage";
import { useAuth } from "@app/providers";

export const LoginForm: React.FC = () => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const { login } = useAuth();
	const navigate = useNavigate();
	const { t } = useTranslation();
	const [messageApi, contextHolder] = message.useMessage();

	const onFinish = async (values: { email: string; password: string }) => {
		setLoading(true);
		try {
			const token = await authApi.login(values.email, values.password);
			setToken(token);
			LocalStorageService.set("user", JSON.stringify(values));
			await login(values.email, values.password);
			messageApi.success(t("auth.successLogin"));
			navigate("/");
		} catch (e: any) {
			setError(e?.response?.data?.message || t("auth.wrongCredentials"));
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
					rules={[{ required: true, message: t("auth.enterPassword") }]}
				>
					<Input.Password
						prefix={<LockOutlined />}
						placeholder={t("auth.password")}
					/>
				</Form.Item>
				<Form.Item>
					<Button type="primary" htmlType="submit" loading={loading} block>
						{t("auth.loginButton")}
					</Button>
				</Form.Item>
			</Form>
			<div style={{ textAlign: "center" }}>
				{t("auth.noAccount")} <Link to="/register">{t("auth.register")}</Link>
			</div>
		</div>
	);
};
