import React from "react";
import ReactDOM from 'react-dom';
import bookService from "../../../service/BookService";
import { Row, Col, Form, Button, Input, Spin, Alert} from "antd";
import Title from "antd/lib/typography/Title";
import Cookies from 'js-cookie';
import {Redirect} from 'react-router-dom';
import {BookOutlined, HighlightOutlined, ApiOutlined} from "@ant-design/icons";


class EditBook extends React.Component {
    state = {
        book: null,
        isLoading: true,
        error: false,
        auth: true,
        editing: false
    };

    editBook = (values) => {
        this.setState({ editing: true });
        bookService.editBook(this.state.book.id, values).then((result) => {
            this.setState({ editing: false });
            ReactDOM.render(<Alert message="Book successfuly edited!" type="success" />, document.getElementById('container'));
         }).catch((error) => {
            this.setState({ editing: false });
            ReactDOM.render(<Alert message="Failed to edit book!" type="error" />, document.getElementById('container'));
         });
    }
    
    componentDidMount() {
        if (Cookies.get("username") === undefined)
        {
            alert("You must login to view this page!");
            this.setState({
                book: null,
                isLoading: false,
                error: false,
                auth: false
            });
            return;
        }
        else if (Cookies.get("isAdmin") === "false") {
            alert("You must be admin to view this page!");
            this.setState({
                book: null,
                isLoading: false,
                error: false,
                auth: false
            });
            return;
        }

        if (this.props.location.state === undefined)
        {
            this.props.history.push("/books");
            return;
        }

        bookService.getBook(this.props.location.state.bookId).then((result) => {
            this.setState({
                book: result,
                isLoading: false,
                error: false
            }); 
        }).catch((error) => {
            this.setState({
                isLoading: false,
                error: true
            }); 
        })


    }

    render() {
        const { isLoading, error, auth, editing } = this.state;
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
                            <Title level={2}> Edit Book </Title>
                        </Col>
                    </Row>

                    <Row type="flex" justify="left" style={{ minHeight: "100vh"}}>
                        <Col style={{width:'600px'}}>
                            <Form name = "book-form" style={{ width:'100%' }} initialValues={{name: this.state.book.name, author: this.state.book.author, image: this.state.book.imageUrl, ebookFile: this.state.book.ebookFile }} onFinish={this.editBook}>
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

export default EditBook;
