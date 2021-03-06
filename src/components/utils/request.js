import axios from "axios";
import { ls } from "./cache";

// 创建实例
const service = axios.create({
  baseURL: "",
  timeout: 50000
});

// 请求拦截器
service.interceptors.request.use(
  config => {
    const apiConfig = ls.get("config");
    const token = ls.get("token") || "";
    if (
      apiConfig &&
      apiConfig.auth &&
      apiConfig.auth.with_auth &&
      apiConfig.auth.headers_key &&
      config.url === "/apidoc/data"
    ) {
      config.headers[apiConfig.auth.headers_key] = token;
    }

    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    return Promise.reject(error);
  }
);

export const sendRequest = (apiUrl, params, type, headers = {}) => {
  const arr = {
    url: apiUrl,
    method: type,
    headers: headers
  };
  if (type === "get") {
    arr.params = params;
  } else {
    arr.data = params;
  }
  return service(arr);
};

export default service;
