import axios from "axios";
import config from "../utility/Config.js";
import Cookies from 'js-cookie';


class BookService {
    getBooks = (page, name) => {
            return axios.get(`${config.getServer()}/api/books/search?name=${name}&pageNumber=${page}&pageSize=12`).then((response) => {
                return {
                        content: response.data.content.map((book) => ({
                                                                        id: book.id,
                                                                        name: book.name,
                                                                        author: book.author,
                                                                        image: book.imageUrl,
                                                                        active: book.active,
                                                                        ebookFile: book.ebookFile
                                                                        })),
                        totalPages: response.data.totalPages
                }
            });
    }

    getBook = (bookId) => {
        return axios.get(`${config.getServer()}/api/books/${bookId}`).then((response) => {
            return response.data;
        });
    }

    getFavBooks = () => {
        return axios.get(`${config.getServer()}/api/users/favorites/${Cookies.get("id")}`).then((response) => {
            return response.data.map((book) => ({
                id: book.id,
                name: book.name,
                author: book.author,
                image: book.imageUrl,
                active: book.active,
                ebookFile: book.ebookFile
            }));
        });
    }

    getReadBooks = () => {
        return axios.get(`${config.getServer()}/api/users/reads/${Cookies.get("id")}`).then((response) => {
            return response.data.map((book) => ({
                id: book.id,
                name: book.name,
                author: book.author,
                image: book.imageUrl,
                active: book.active,
                ebookFile: book.ebookFile
            }));
        });
    }

    markFavBook = (id) => {
        return axios.post(`${config.getServer()}/api/users/favorites/mark/${Cookies.get("id")}/${id}`).then((response) => {
            return response.data;
        });
    }

    markReadBook = (id) => {
        return axios.post(`${config.getServer()}/api/users/reads/mark/${Cookies.get("id")}/${id}`).then((response) => {
            return response.data;
        });
    }

    addNewBook = (values) => {
        return axios.post(`${config.getServer()}/api/books`, values).then((response) => {
            return response.data;
        });
    }

    deleteBook = (bookId) => {
        return axios.delete(`${config.getServer()}/api/books/${bookId}`).then((response) => {
            return response.data;
        });
    }

    editBook = (bookId, values) => {
        return axios.put(`${config.getServer()}/api/books/${bookId}`, values).then((response) => {
            return response.data;
        });
    }
}

export default new BookService();