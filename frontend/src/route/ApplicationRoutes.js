import React, { useState } from "react";
import {
    BrowserRouter as Router,
    Route,
    Switch,
    Redirect
} from "react-router-dom";
import {MenuFoldOutlined, MenuUnfoldOutlined} from "@ant-design/icons";

import SideNavigation from "../components/layout/SideNavigation";
import login from "../components/pages/login/Login";
import userList from "../components/pages/user/UserList";
import books from '../components/pages/book/BookList';
import favBooks from '../components/pages/book/FavBookList';
import readBooks from '../components/pages/book/ReadBookList';
import addBook from '../components/pages/book/AddBook';
import register from '../components/pages/login/Register';
import logout from '../components/pages/login/Logout';
import readbook from "../components/pages/book/ReadBook";
import editBook from "../components/pages/book/EditBook";
import editUser from "../components/pages/user/EditUser";

import {Layout} from "antd";
    
const {Header, Sider, Content} = Layout;

const ApplicationRoutes =  ()=> {
    const [collapse, setCollapse] = useState(false);

    const handleToggle = (event) => {
        event.preventDefault();
        collapse ? setCollapse(false) : setCollapse(true);
    };

    return (
        <Router>
            <Layout>
                <Sider trigger={null} collapsible collapsed={collapse}>
                    <SideNavigation />
                </Sider>
                <Layout>
                    <Header
                        className="siteLayoutBackground"
                        style={{padding: 0, background: "#001529"}}
                    >
                        {React.createElement (collapse ? MenuUnfoldOutlined : MenuFoldOutlined,
                        {
                            className: "trigger",
                            onClick: handleToggle,
                            style: { color: "#fff"},
                        }
                        )}
                    </Header>
                    <Content style = {{margin: "24px 16px",
                                        padding: 24,
                                        minHeight: "calc(100vh -114px)",
                                        background: "#fff",
                                    }}
                    >
                        <Switch>
                            <Route path="/login" component={login} />
                            <Route path="/users" component={userList} />
                            <Route path="/books" component={books} />
                            <Route path="/favorites" component={favBooks} />
                            <Route path="/reads" component={readBooks} />
                            <Route path="/addBook" component={addBook} />
                            <Route path="/register" component={register} />
                            <Route path="/logout" component={logout} />
                            <Route path="/readBook" component={readbook} />
                            <Route path="/editBook" component={editBook} />
                            <Route path="/editUser" component={editUser} />
                            <Redirect to = "/login" from="/" />
                        </Switch>
                    </Content>
                </Layout>
            </Layout>
        </Router>
    );
};

export default ApplicationRoutes;