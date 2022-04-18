import React from 'react';
import { Menu } from 'antd';
import {ToolOutlined, LoginOutlined, LogoutOutlined, BookOutlined, ReadOutlined, StarOutlined, UserOutlined, PlusOutlined} from '@ant-design/icons';
import { useHistory } from 'react-router';
import {useLocation} from "react-router-dom";
import Cookies from 'js-cookie';
const { SubMenu } = Menu;

const SideNavigation = () => {
    const history = useHistory();

    const handleUserClick = () => {
        history.push("/users");
    };

    const handleLoginClick = () => {
        history.push("/login");
    };

    const handleLogoutClick = () => {
        history.push("/logout");
    }

    const handleBookClick = () => {
        history.push("/books");
    };

    const handleFavoriteClick = () => {
        history.push("/favorites");
    };

    const handleReadClick = () => {
        history.push("/reads");
    };
    
    const handleAddBookClick = () => {
        history.push("/addBook");
    }

    let location = useLocation();
    
    return (
        <div>
            <div
                style={{
                    height: "32 px",
                    background: "rgba(255, 255, 255, 0.2)",
                    margin: "16px",
                }}
            ></div>
            <Menu theme="dark" mode="inline" selectedKeys={[location.pathname]}>
            {Cookies.get("isAdmin") === "true" ? (

                <SubMenu key="sub1" title={<span><ToolOutlined />
                    <span> Admin </span></span>}>
                    <Menu.Item key="userList" onClick={handleUserClick}><UserOutlined />Users</Menu.Item>
                    <Menu.Item key="addBook" onClick={handleAddBookClick}><PlusOutlined />Add New Book</Menu.Item>
                    </SubMenu>) : ( <> </>)}
                
                <Menu.Item key="/books" onClick={handleBookClick}>
                    <BookOutlined />
                    <span> Books </span>
                </Menu.Item>
                {Cookies.get("username") !== undefined ? (
                <Menu.Item key="/favorites" onClick={handleFavoriteClick}>
                    <StarOutlined />
                    <span> My Favorites </span>
                </Menu.Item>):(<></>)}
                {Cookies.get("username") !== undefined ? (
                <Menu.Item key="/reads" onClick={handleReadClick}>
                    <ReadOutlined />
                    <span> Read Books </span>
                </Menu.Item>):(<></>)}

                <Menu.Item key = "/login" onClick={() => { Cookies.get("username") === undefined ? handleLoginClick() : handleLogoutClick()}}>
                    {Cookies.get("username") === undefined ? (
                        <>
                    <LoginOutlined />
                    <span> Login </span>
                    </>
                    ) : (
                        <>
                    <LogoutOutlined />
                    <span>Logout</span>
                    </>
                    )}
                </Menu.Item>
            </Menu>
        </div>
    );
};

export default SideNavigation;