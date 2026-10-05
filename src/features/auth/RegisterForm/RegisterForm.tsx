import React, { useEffect } from "react";
import { Form, Input, Button, Alert, message } from "antd";
import { MailOutlined, LockOutlined, UserOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "@app/hooks";
import { Credentials, register } from "@entities/User/model";

export const RegisterForm: React.FC = () => {
	const dispatch = useAppDispatch();
	const { loading, error, token } = useAppSelector((s) => s.auth);

	const navigate = useNavigate();
	const { t } = useTranslation();
	const [messageApi, contextHolder] = message.useMessage();

	useEffect(() => {
		console.log(token);
		if (token) navigate(import.meta.env.VITE_BASE_URL);
	}, [token, navigate]);

	const onFinish = async (values: Credentials) => {
		const result = await dispatch(register(values));

		if (register.fulfilled.match(result)) {
			messageApi.success(t("auth.successRegister"));
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
