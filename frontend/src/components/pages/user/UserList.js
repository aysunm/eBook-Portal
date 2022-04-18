import React from "react";
import axios from "axios";

import { getUsers } from "../../../service/UserService";
import { Row, Col, Table, Space, Tooltip } from "antd";
import Title from "antd/lib/typography/Title";
import Cookies from 'js-cookie';
import {Redirect} from 'react-router-dom';
import {DeleteOutlined, EditOutlined} from "@ant-design/icons";


class UserList extends React.Component {

    state = {
        users: [],
        isLoading: true,
        error: null,
        auth: true
    };

    deleteUser = (userId) => {
        axios.delete(`/api/users/${userId}`).then((result) => {
            this.state.users.find((user, index) => 
            { 
                if(user.id == userId)
                {
                    this.state.users.splice(index, 1);
                    return true;
                }
            });
            this.setState(
                {
                    users: [...this.state.users]
                });
        }).catch((error) => alert("error occurred while deleting user!"));
    }

    editUser = (id) => {
        this.props.history.push({
            pathname: "/editUser",
            state: {userId: id}
        });
    }

    columns = [
        {
            title: "Id",
            dataIndex: "id"
        },
        {
            title: "Username",
            dataIndex: "username",
        },
        {
            title: "Join date",
            dataIndex: "createDate"
        },
        {
            title: "Role",
            dataIndex: "roles",
            render: (roles) => {
                return (
                <Space size="middle">
                    <span>{roles.map((role, index) => { return (roles[index].name === "ROLE_ADMIN" ? "Admin " : "User ") })}</span>
                </Space>);
            }
        },
        {
            title: "",
            key: "delete",
            dataIndex: "id",
            render: (key, record) => {
                return (
                <Space size="middle">
                    <Tooltip placement="top" title="Delete User">
                    <button onClick={() => this.deleteUser(key)}><DeleteOutlined /></button>
                    </Tooltip>
                    <Tooltip placement="top" title="Edit User">
                        <button onClick={() => { this.editUser(key) }}><EditOutlined /></button>
                    </Tooltip>
                </Space>);
            }
        }
    ];


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

        getUsers()
            .then((users) => {
                let data = [];

                users.map((user, index) => {
                    if (user.active) {
                        data.push({
                            id: user.id,
                            createDate: user.createDate,
                            active: user.active,
                            username: user.username,
                            roles: user.roles
                        });
                    }
                    return data;
                });

                this.setState({
                    users: data,
                    isLoading: false,
                    auth: true
                });
            })
            .catch((error) => this.setState({ error, isLoading: false, auth: true }));
    }

    render() {
        const { users, isLoading, error, auth } = this.state;
        if (!auth)
        {
            return (<Redirect to='/login'/>);
        }

        return (
            <React.Fragment>
                {!isLoading ? (
                    error ? (
                        `An error occured: ${error}`
                    ) : (
                        <>
                            <Row gutter={[40, 0]}>
                                <Col span={24}>
                                    <Title level={2}> User List</Title>
                                </Col>
                            </Row>
                            <Row gutter={[40, 0]}>
                                <Col span={24}>
                                    <Table columns={this.columns} dataSource={users} />
                                </Col>
                            </Row>
                        </>
                    )
                ) : (
                    <p> Loading... </p>
                )}
            
            </React.Fragment>
        );
    }          
}

export default UserList;
