import axios from "axios";

const apiHost = "http://localhost:3001";
const api = axios.create({
    baseURL: apiHost,
});
api.defaults.headers["Access-Control-Allow-Origin"] = "*";
export default api;