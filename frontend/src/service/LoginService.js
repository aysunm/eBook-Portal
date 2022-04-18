import axios from "axios";
import config from "../utility/Config.js";
import Cookies from 'js-cookie';

class LoginService {
    login = async (username, password) => {
        try {
            var result = await axios.post(`${config.getServer()}/login?username=${username}&password=${password}`);
            Cookies.set("username", result.data.username);
            Cookies.set("id", result.data.id);
            Cookies.set("isAdmin", result.data.isAdmin);
            return "OK";
        }
        catch (error) {
            console.log(error);
            return "FAILED";
        }
    }

    logout = async () => {
        try {
            await axios.post(`${config.getServer()}/logout`).then((result) => {
                Cookies.remove("JSESSIONID");
                Cookies.remove("username");
                Cookies.remove("id");
                Cookies.remove("isAdmin");    
            });
            return "OK";
        }
        catch (error) {
            console.log(error);
            return "FAILED";
        }
    }

    register = async (values) => {
        try {
            var result = await axios.post(`${config.getServer()}/api/users`, values);
            return "OK";
        }
        catch (error) {
            console.log(error);
            return "FAILED";
        }
    }
}

export default LoginService;