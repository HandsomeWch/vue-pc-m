/* 
    封装axios拦截器
        1. 设置公共的请求地址前缀
        2. 请求拦截器：添加公共参数
        3. 响应拦截器: 
        成功：返回成功的Promise，值为成功的数据
        失败：返回失败的Promise，值为失败的原因
*/
import axios from "axios";
import {
    Message
} from "element-ui"
import getUserTempId from "@utils/getUserTempId";
import store from '../store'
//引入进度条插件
import NProgress from "nprogress";
import "nprogress/nprogress.css";
/*
	userTempId 未登录用户的临时id
		通过uuid来生成
	1. 因为每个userTempId自己的购物车数据
			后台会根据userTempId的值来返回购物车数据
			如果userTempId刷新了，购物车数据就没了（清空了）
		所以生成后要持久存储起来，未来将来可以反复使用	
			localStorage 永久存储
			sessionStorage 回话存储（一旦关闭浏览器数据就会被清空）
				xxx.setItem(key, value) 存储
				xxx.getItem(key) 读取
				xxx.removeItem(key) 删除单个
				xxx.clear() 清空所有
	
	2. 整体流程：
		- 先读取本地localStorage数据，看是否有userTempId
		- 如果有，直接使用
		- 如果没有，需要创建userTempId，同时保存在localStorage中

	3. 在内存中缓存一份localStorage数据，让性能更好
*/
const userTempId = getUserTempId();

const instance = axios.create({
    baseURL: "/api", //公共基础路径
    headers: {

    }
});

//设置请求拦截器
instance.interceptors.request.use(
    (config) => {
        //config 请求的配置对象
        //开始进度条
        NProgress.start();
        const token = store.state.token;
        if(token){
            config.headers.token = token;
        }

        config.headers.userTempId = userTempId;
        return config;
    }
);
// 设置响应拦截器
instance.interceptors.response.use(
    (response) => {
        // 进度条结束
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