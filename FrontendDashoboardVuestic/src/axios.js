import axios from "axios";
window.axios = axios;

window.axios.defaults.withCredentials = true;
window.axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
window.axios.defaults.baseURL = "http://localhost:8000";

/*axios.defaults.withCredentials = true;
axios.defaults.baseURL = "http://localhost:8000";*/