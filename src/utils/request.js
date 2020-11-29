/* 
    封装axios拦截器
*/
import axios from "axios";
import {
    Message
} from "element-ui"
//引入进度条插件
import NProgress from "nprogress";
import "nprogress/nprogress.css";
const instance = axios.create({
    baseURL: "/api", //公共基础路径
    headers: {

    }
});

//设置请求拦截器
instance.interceptors.request.use(
    (config) => {
        //config 请求的配置对象

        NProgress.start();
        return config;
    }
);
instance.interceptors.response.use(
    (response) => {
        NProgress.done();
        if (response.data.code === 200) {
            return response.data.data;
        }
        const {
            message
        } = response.data;
        Message.error(message)
        return Promise.reject(message)
    },
    (error) => {
        //进度条结束
        NProgress.done();
        const message = error.message || "网络错误";
        Message.error(message);
        return Promise.reject(message);
    }
);
export default instance;