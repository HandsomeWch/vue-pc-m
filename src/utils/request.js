/* 
    封装axios拦截器
*/
import axios from "axios";

const instance = axios.create({
    baseURL: "/api", //公共基础路径
    headers: {

    }
});

//设置请求拦截器
instance.interceptors.request.use(
    (config) => {
        //config 请求的配置对象
        return config;
    }
);
instance.interceptors.response.use(
    (response) => {
        if (response.data.code === 200) {
            return response.data.data
        }
        return Promise.reject(response.data.message)
    },
    (error) => {
        const message = error.message || "网络错误";
        return Promise.reject(message);
    }
);
export default instance;