import React from "react";
import bookService from "../../../service/BookService";
import { Row, Col, Divider, Space, Input, Button, Pagination, Tooltip} from "antd";
import Title from "antd/lib/typography/Title";
import Cookies from 'js-cookie';
import {Redirect} from 'react-router-dom';
import {StarOutlined, StarFilled, ReadOutlined, ReadFilled, DeleteOutlined, SearchOutlined, PlayCircleOutlined,EditOutlined} from "@ant-design/icons";

const style = { background: 'lightgrey', padding: '8px 0' };
class BookList extends React.Component {
      
    state = {
        books: [],
        allBooks: [],
        isLoading: true,
        error: null,
        auth: true,
        curpage: 1,
        maxpage: 1,
        filter: ""
    };

    markFav(bookId) {
        bookService.markFavBook(bookId).then((result) => {
            var bk = this.state.books.find((book) => { return book.key == bookId; });
            bk.fav = !bk.fav;
            this.setState(
                {
                    books: [...this.state.books]
                });
        }).catch((error) => {
            alert("an error occurred while marking favorite book!");
        });
    }

    markRead(bookId) {
        bookService.markReadBook(bookId).then((book) => {
            var bk = this.state.books.find((book) => { return book.key == bookId; });
            bk.read = !bk.read;
            this.setState(
                {
                    books: [...this.state.books]
                });        
            }).catch((error) => {
            alert("an error occurred while marking read book!");
        });
    }

    deleteBook(bookId) {
        bookService.deleteBook(bookId).then((result) => {
           this.loadPage(this.state.curpage);
        }).catch((error) => {
            alert("an error occurred while deleting book!");
        })
    }

    readBook(ebookFile) {
        this.props.history.push({
            pathname: "/readBook",
            state: {ebook: ebookFile}
        });
    }

    editBook(id) {
        this.props.history.push({
            pathname: "/editBook",
            state: {bookId: id}
        });
    }

    search = () => {
        this.state.filter = document.getElementById("search-txt").value.toLowerCase();
        this.state.curpage = 1;
        this.loadPage(1);
    }

    onChange = page => {
        this.loadPage(page);
        this.setState({
          curpage: page,
        });
      };
    
    loadPage(page) {
        bookService.getBooks(page - 1, this.state.filter)
            .then((books) => {
                let data = [];

                books.content.map((book, index) => {
                    if (book.active) {
                        data.push({
                            key: book.id,
                            name: book.name,
                            author: book.author,
                            image: book.image,
                            ebookFile: book.ebookFile,
                            fav: false,
                            read: false
                        });
                    }
                    return data;
                });
                var totalPages = books.totalPages;
                this.setState({
                    books: data,
                    allBooks: [...data],
                    curpage: page,
                    maxpage: totalPages,
                    isLoading: true,
                    auth: true
                });
                return data;
            })
            .catch((error) => this.setState({ error, isLoading: false, auth: true })).then((data) => {
                bookService.getFavBooks()
                .then((favs) => {
                    favs.map((book, index) => {
                        //book.id
                        data.find((val, idx) => {
                            if (val.key === book.id) {
                                data[idx].fav = true;
                                return data;
                            }
                        });
                        return data;
                    });
                    return data;
                })
                .catch((error) => this.setState({ error, isLoading: false, auth: true })).then((data) => {
                    bookService.getReadBooks()
                    .then((reads) => {
                        reads.map((book, index) => {
                            //book.id
                            data.find((val, idx) => {
                                if (val.key === book.id) {
                                    data[idx].read = true;
                                    return data;
                                }
                            });
                            return data;
                        });

                        this.setState({
                            books: data,
                            isLoading: false,
                            auth: true
                        });
                        return data;
                    })
                });
            });
    }

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
        this.loadPage(1);
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
                        `An error occured: ${error}`
                    ) : (
                        <div style={{ minHeight: "100vh"}}>
                            <Row gutter={[40, 0]}>
                                <Col span={24}>
                                    <Title level={2}> Book List</Title>
                                </Col>
                            </Row>
                            <Row gutter={[40, 0]}>
                                <Col span={24}>
                                    <Input id="search-txt" placeholder="Search books..." style={{width:'30%'}} defaultValue={this.state.filter}/>
                                    <Button onClick={this.search}><SearchOutlined />Search</Button>
                                </Col>
                            </Row>
                            <Divider orientation="left"></Divider>
                            <Row gutter={[16, 30]}>
                            {this.state.books.map((record, index)=> {
                                return (
                                <Col className="gutter-row" span={6}>
                                    <div style={style}>
                                        <Row gutter={16}>
                                            <Col classname="gutter-row" span={8} >
                                            <img alt={record.image} src={record.image} style={{height:"200px", width:"100%"}} />
                                            </Col>

                                            <Col classname="gutter-row" span={16}>
                                            <div style={{position:'absolute', top:'25%'}}>
                                            <font size="4"><b>
                                                <span>{record.name}</span> <br/> </b>
                                                <span>{record.author}</span>
                                            </font>
                                            <br /> <br />
                                            <Space size="middle">
                                            <Tooltip placement="top" title={record.fav ? "Remove Favorite" : "Add Favorite"}>
                                                <button onClick={() => this.markFav(record.key)}>{!record.fav ? (<StarOutlined />):(<StarFilled />)}</button>
                                            </Tooltip>
                                            <Tooltip placement="top" title={record.read ? "Remove Read List" : "Add Read List"}>
                                                <button onClick={() => this.markRead(record.key)}>{!record.read ? (<ReadOutlined />):(<ReadFilled />)}</button>
                                            </Tooltip>
                                            <Tooltip placement="top" title="Read Book">
                                                <button onClick={() => this.readBook(record.ebookFile)}><PlayCircleOutlined /></button>
                                            </Tooltip>
                                                {Cookies.get("isAdmin") === "true" ? 
                                                (
                                                <>
                                                <Space size="middle">
                                                <Tooltip placement="top" title="Edit Book"><button onClick={() => this.editBook(record.key)}><EditOutlined /></button></Tooltip>
                                                <Tooltip placement="top" title="Remove Book"><button onClick={() => this.deleteBook(record.key)}><DeleteOutlined /></button></Tooltip></Space></>):("")}
                                            </Space>
                                            </div>
                                            </Col>
                                        </Row>
                                    </div>
                                </Col>
                                )})}
                            </Row>
                            <Pagination defaultCurrent={this.state.curpage} onChange={this.onChange} total={this.state.maxpage * 10} />
                            <div id="route-container"></div>
                        </div>
                    )
                ) : (
                    <div style={{ minHeight: "100vh"}}>
                    <p> Loading... </p>
                    </div>
                )}
            
            </React.Fragment>
        );
    }          
}

export default BookList;
