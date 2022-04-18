//https://github.com/openpreserve/format-corpus/raw/master/ebooks/calibre%200.9.0/lorem-ipsum.epub

import React from "react";
import { Row, Col, Table, Space } from "antd";
import Title from "antd/lib/typography/Title";
import Cookies from 'js-cookie';
import {Redirect} from 'react-router-dom';
import { ReactReader } from "react-reader";


class ReadBook extends React.Component {
    state = {
        epub: "",
        isLoading: true,
        error: null,
        auth: true
    };

    componentDidMount() {
        if (Cookies.get("username") === undefined)
        {
            alert("You must login to view this page!");
            this.setState({
                epub: null,
                isLoading: false,
                error: false,
                auth: false
            });
            return;
        }
        this.setState({
            isLoading: false,
            auth: true
        })
    }

    render() {
        const { epub, isLoading, error, auth } = this.state;
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
                        <div style={{ position: "relative", height: "100%", minHeight: "100vh" }}>
                                <ReactReader
                                url={`/${this.props.location.state.ebook}`}
                                locationChanged={epubcifi => console.log(epubcifi)}
                                tocChanged={toc => console.log(toc)}
                                />

                        </div>
                    )
                ) : (
                    <p> Loading... </p>
                )}
            
            </React.Fragment>
        );
    }          
}

export default ReadBook;
