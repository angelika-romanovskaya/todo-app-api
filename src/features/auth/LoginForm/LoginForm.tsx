import React, { useEffect } from 'react';
import { Form, Input, Button, Alert, message } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@app/hooks';
import { Credentials, login } from '@entities/User/model';

export const LoginForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const { loading, error, token } = useAppSelector((s) => s.auth);

  const navigate = useNavigate();
  const { t } = useTranslation();
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    if (token) navigate('/');
  }, [token, navigate]);

  const onFinish = async (values: Credentials) => {
    const result = await dispatch(login(values));

    if (login.fulfilled.match(result)) {
      messageApi.success(t('auth.successLogin'));
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
              type: 'email',
              message: t('auth.enterValidEmail'),
            },
          ]}
        >
          <Input prefix={<MailOutlined />} placeholder="Email" />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: t('auth.enterPassword') }]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder={t('auth.password')}
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            {t('auth.loginButton')}
          </Button>
        </Form.Item>
      </Form>

      <div style={{ textAlign: 'center' }}>
        {t('auth.noAccount')}{' '}
        <Link to="/register">{t('auth.register')}</Link>
      </div>
    </div>
  );
};