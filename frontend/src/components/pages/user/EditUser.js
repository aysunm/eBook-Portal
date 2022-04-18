import React from "react";
import ReactDOM from 'react-dom';
import { editUser, getUser } from "../../../service/UserService";
import { Row, Col, Form, Button, Input, Spin, Alert, Switch, Checkbox } from "antd";
import Title from "antd/lib/typography/Title";
import Cookies from 'js-cookie';
import {Redirect} from 'react-router-dom';
import {BookOutlined, HighlightOutlined, ApiOutlined} from "@ant-design/icons";


class EditUser extends React.Component {
    state = {
        user: null,
        isLoading: true,
        error: false,
        auth: true,
        editing: false,
        adminRole: false,
        userRole: false,
    };

    edit = (values) => {
        this.setState({ editing: true });
        editUser(this.state.user.id, { password: values.password, adminRole: this.state.adminRole, userRole: this.state.userRole}).then((result) => {
            this.setState({ editing: false });
            ReactDOM.render(<Alert message="User successfuly edited!" type="success" />, document.getElementById('container'));
         }).catch((error) => {
            this.setState({ editing: false });
            ReactDOM.render(<Alert message="Failed to edit user!" type="error" />, document.getElementById('container'));
         });
    }
    
    componentDidMount() {
        if (Cookies.get("username") === undefined)
        {
            alert("You must login to view this page!");
            this.setState({
                users: null,
                isLoading: false,
                error: false,
                auth: false
            });
            return;
        }
        else if (Cookies.get("isAdmin") === "false") {
            alert("You must be admin to view this page!");
            this.setState({
                users: null,
                isLoading: false,
                error: false,
                auth: false
            });
            return;
        }

        if (this.props.location.state === undefined)
        {
            this.props.history.push("/users");
            return;
        }

        getUser(this.props.location.state.userId).then((result) => {
            this.setState({
                user: result,
                isLoading: false,
                error: false,
                adminRole: result.roles.findIndex((element, index, array) => element.name == "ROLE_ADMIN") != -1 ,
                userRole: result.roles.findIndex((element, index, array) => element.name == "ROLE_USER") != -1
            }); 
        }).catch((error) => {
            this.setState({
                isLoading: false,
                error: true
            }); 
        })


    }

    render() {
        const { user, isLoading, error, auth, editing } = this.state;
        if (!auth)
        {
            return (<Redirect to='/login'/>);
        }
        return (
            <React.Fragment>
                {!isLoading ? (
                    error ? (
                        `An error occurred: ${error}`
                    ) : (
                    
                    <div style={{ width: '600px' }}>
                    <Row gutter={[40, 0]}>
                        <Col span={24}>
                            <Title level={2}> Edit User ({user.username}) </Title>
                        </Col>
                    </Row>

                    <Row type="flex" justify="left" style={{ minHeight: "100vh"}}>
                        <Col style={{width:'600px'}}>
                            <Form name = "book-form" style={{ width:'100%' }} 
                                initialValues={{password: "",
                                               adminRole: user.roles.findIndex((element, index, array) => element.name == "ROLE_ADMIN") != -1 ,
                                               userRole: user.roles.findIndex((element, index, array) => element.name == "ROLE_USER") != -1}}
                                               onFinish={this.edit}>
                                <Form.Item
                                    name="password"
                                    >
                                    <Input
                                        size="large"
                                        type="password"
                                        prefix={<BookOutlined className="site-form-item-icon" />}
                                        placeholder="New Password (Leave blank if you dont want to update password)"
                                    />
                                </Form.Item>
                                <Form.Item name="adminRole" label="Admin">
                                <Checkbox valuePropName='checked' defaultChecked={user.roles.findIndex((element, index, array) => element.name === "ROLE_ADMIN") != -1}
                                onChange={(e) => this.state.adminRole = e.target.checked}>
                                    Admin</Checkbox>
                                 </Form.Item>
                                 <Form.Item name="userRole" label="User">
                                <Checkbox valuePropName='checked' defaultChecked={user.roles.findIndex((element, index, array) => element.name === "ROLE_USER") != -1}
                                onChange={(e) => this.state.userRole = e.target.checked}>
                                    User
                                </Checkbox>
                                 </Form.Item>
                                <Form.Item>
                                   {!editing ? (<Button type="primary" htmlType="submit" style={{width: 100}}>
                                        Edit
                                    </Button>) : (<Spin size="large" />)}
                                </Form.Item>
                                <Form.Item>
                                    <div id="container"/>
                                </Form.Item>
                            </Form>
                        </Col>
                    </Row>
                    </div>
                    )
                ) : (
                    <p> Loading... </p>
                )}
            
            </React.Fragment>
        );
    }          
}

export default EditUser;
