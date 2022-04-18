import React from "react";
import ReactDOM from 'react-dom';
import bookService from "../../../service/BookService";
import { Row, Col, Form, Button, Input, Spin, Alert} from "antd";
import Title from "antd/lib/typography/Title";
import Cookies from 'js-cookie';
import {Redirect} from 'react-router-dom';
import {BookOutlined, HighlightOutlined, ApiOutlined} from "@ant-design/icons";


class AddBook extends React.Component {
    state = {
        isLoading: true,
        error: false,
        auth: true,
        adding: false
    };

    addBook = (values) => {
        this.setState({ adding: true });
        bookService.addNewBook(values).then((result) => {
            this.setState({ adding: false });
            ReactDOM.render(<Alert message="Book successfuly added!" type="success" />, document.getElementById('container'));
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

        this.setState({
            isLoading: false,
            error: false
        }); 
    }

    render() {
        const { isLoading, error, auth, adding } = this.state;
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
                            <Title level={2}> Add New Book </Title>
                        </Col>
                    </Row>

                    <Row type="flex" justify="left" style={{ minHeight: "100vh"}}>
                        <Col style={{width:'600px'}}>
                            <Form name = "book-form" style={{ width:'100%' }} onFinish={this.addBook}>
                                <Form.Item
                                    name="name"
                                    rules={[{required: true, message: "Enter book name!"}]}
                                    >
                                    <Input
                                        size="large"
                                        prefix={<BookOutlined className="site-form-item-icon" />}
                                        placeholder="Book Name"
                                    />
                                </Form.Item>
                                <Form.Item
                                    name="author"
                                    rules={[{required: true, message: "Enter Author!"}]}
                                    >
                                    <Input
                                        size="large"
                                        prefix={<HighlightOutlined className="site-form-item-icon" />}
                                        placeholder="Author"
                                    />
                                </Form.Item>
                                <Form.Item
                                    name="image"
                                    rules={[{required: true, message: "Enter Image URL!"}]}
                                    >
                                    <Input
                                        size="large"
                                        prefix={<ApiOutlined className="site-form-item-icon" />}
                                        placeholder="Image URL"
                                    />
                                </Form.Item>
                                <Form.Item 
                                    name="ebookFile"
                                    rules={[{required: true, message: "Enter Ebook File Name"}]}
                                >
                                      <Input
                                        size="large"
                                        prefix={<ApiOutlined className="site-form-item-icon" />}
                                        placeholder="Ebook"
                                    />
                                </Form.Item>
                                <Form.Item>
                                   {!adding ? (<Button type="primary" htmlType="submit" style={{width: 100}}>
                                        Add
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

export default AddBook;
