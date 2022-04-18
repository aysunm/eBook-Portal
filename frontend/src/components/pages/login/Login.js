import React from 'react';
import {useHistory} from 'react-router';
import ReactDOM from 'react-dom';

import {Form, Input, Button, Col, Row, Alert} from 'antd';
import {UserOutlined, LockOutlined, FormOutlined} from '@ant-design/icons';
import Title from "antd/lib/typography/Title";

import loginService from '../../../service/LoginService.js'
import Cookies from 'js-cookie'

const NormalLoginForm = () => {
    const history = useHistory();
    const lService = new loginService();

    const login = values => {
        //history.push("/users");
        lService.login(values.username, values.password).then((result) => 
        {
            if (result === "OK") {
                history.push("/books");
            } else {
                ReactDOM.render(<Alert message="Error!" description="Invalid username or password!" type="error" />, document.getElementById('container'));
            }
        });
    };

    const goRegister = () => {
        history.push("/register");
    }

    if (Cookies.get("username") === undefined)
    {
        return (
            <>
            <Row gutter={[40, 0]}>
                        <Col span={24}>
                            <Title level={2}> Login </Title>
                        </Col>
            </Row>
            
            <Row type="flex" justify="center" style={{ minHeight: "100vh"}}>
                <Col>
                    <Form name = "login-form" style={{ maxWidth: 300}} onFinish={login}>
                        <Form.Item
                            name="username"
                            rules={[{required: true, message: "Enter username!"}]}
                            >
                            <Input
                                prefix={<UserOutlined className="site-form-item-icon" />}
                                placeholder="Username"
                            />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[{required: true, message: "Enter password!"}]}
                            >
                            <Input
                                prefix={<LockOutlined className="site-form-item-icon" />}
                                type="password"
                                placeholder="Password"
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" style={{width: 100}}>
                                Login
                            </Button>
                        </Form.Item>
                        <Form.Item>
                            <Button onClick={goRegister}><FormOutlined /> Don't have account? Register!</Button>
                        </Form.Item>
                        <Form.Item>
                            <div id="container" />
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
            </>
        );
    }
    else
    {
        history.push("/books");

        return (<p>
            already logged in...
        </p>);
    }
};

export default NormalLoginForm;