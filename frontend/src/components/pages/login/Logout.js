import React from 'react';
import {useHistory} from 'react-router';
import ReactDOM from 'react-dom';

import {Form, Input, Button, Col, Row, Alert} from 'antd';
import {UserOutlined, LockOutlined, FormOutlined} from '@ant-design/icons';
import Title from "antd/lib/typography/Title";

import loginService from '../../../service/LoginService.js'
import Cookies from 'js-cookie'

const LogoutPage = () => {
    const history = useHistory();
    const lService = new loginService();

    if (Cookies.get("username") === undefined)
    {
        history.push("/login");
        return (<p>Redirecting to login page..</p>)
    }
    else
    {
        lService.logout().then((result) => {
            history.push("/login");
        });
        return (<p>
            Logging out...
        </p>);
    }
};

export default LogoutPage;