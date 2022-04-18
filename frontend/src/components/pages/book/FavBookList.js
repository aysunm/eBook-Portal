import React from "react";
import bookService from "../../../service/BookService";
import { Row, Col, Table, Space, Tooltip,} from "antd";
import Title from "antd/lib/typography/Title";
import Cookies from 'js-cookie';
import {Redirect} from 'react-router-dom';
import {DeleteOutlined, PlayCircleOutlined} from "@ant-design/icons";

class FavBookList extends React.Component {
    state = {
        books: [],
        isLoading: true,
        error: null,
        auth: true
    };

    markFav(bookId) {
        bookService.markFavBook(bookId).then((result) => {
            this.state.books.find((book, index) => 
            { 
                if(book.key == bookId)
                {
                    this.state.books.splice(index, 1);
                    return true;
                }
            });
            this.setState(
                {
                    books: [...this.state.books]
                });
        }).catch((error) => {
            alert("an error occurred while removing favorite book!");
        });
    }

    readBook(ebookFile) {
        this.props.history.push({
            pathname: "/readBook",
            state: {ebook: ebookFile}
        });
    }

    columns = [
        {
            title: "",
            dataIndex: "image",
            render: (url) => <img alt={url} src={url} style={{height:"120px", width:"80px"}} />,
        },
        {
            title: "Name",
            dataIndex: "name",
        },
        {
            title: "Author",
            dataIndex: "author",
        },
        {
            title: "",
            key: "fav",
            dataIndex: "key",

            render: (key) => (
                <Space size="middle">
                    <Tooltip placement="top" title="Remove from Favorites">
                    <button onClick={() => this.markFav(key)}><DeleteOutlined /></button></Tooltip>
                </Space>
              ),
        },
        {
            title: "",
            key: "readbook",
            dataIndex: "key",

            render: (key, record) => (
              <Space size="middle">
                   <Tooltip placement="top" title="Read Book">
                        <button onClick={() => this.readBook(record.ebookFile)}><PlayCircleOutlined /></button>
                    </Tooltip>
              </Space>  
            ),
        }
    ];


    componentDidMount() {
        if (Cookies.get("username") === undefined)
        {
            alert("You must login to view this page!");
            this.setState({
                books: null,
                isLoading: false,
                error: false,
                auth: false
            });
            return;
        }
        bookService.getFavBooks()
            .then((books) => {
                let data = [];

                books.map((book, index) => {
                    if (book.active) {
                        data.push({
                            key: book.id,
                            name: book.name,
                            author: book.author,
                            image: book.image,
                            ebookFile: book.ebookFile
                        });
                    }
                    return data;
                });

                this.setState({
                    books: data,
                    isLoading: false,
                    auth: true
                });
            })
            .catch((error) => this.setState({ error, isLoading: false, auth: true }));
    }

    render() {
        const { books, isLoading, error, auth } = this.state;
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
                        <div style={{ minHeight: "100vh"}}>
                            <Row gutter={[40, 0]}>
                                <Col span={24}>
                                    <Title level={2}>My Favorite Book List</Title>
                                </Col>
                            </Row>
                            <Row gutter={[40, 0]}>
                                <Col span={24}>
                                    <Table columns={this.columns} dataSource={books} />
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

export default FavBookList;
