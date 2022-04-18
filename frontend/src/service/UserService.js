import axios from "axios";
import config from "../utility/Config.js";

/*
export const getUsers = () => {
  return axios.get("https://randomuser.me/api/?results=50").then((response) => {
    return response.data.results.map((user) => ({
      username: user.login.username,
      name: `${user.name.first} ${user.name.last}`,
      image: user.picture.large,
      email: user.email,
      phone: user.phone
    }));
  });
};
*/

export const getUsers = () => {
  return axios.get(`${config.getServer()}/api/users`).then((response) => {
    return response.data.content.map((user) => ({
      id: user.id,
      createDate: user.createDate,
      active: user.active,
      username: user.username,
      roles: user.roles
    }));
  })
}

export const getUser = (id) => {
  return axios.get(`${config.getServer()}/api/users/${id}`).then((response) => {
    return response.data;
  })
}

export const editUser = (id, values) => {
  console.log(values);
  return axios.put(`${config.getServer()}/api/users/${id}`, values).then((response) => {
    return response.data;
  })
}

