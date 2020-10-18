import axios from 'axios'
import router from "@/router";
import { Notify } from 'vant'

// 创建 axios 实例
const request = axios.create({
    // API 请求的默认前缀
    baseURL: process.env.VUE_APP_API_BASE_URL,
    //timeout: 6000 // 请求超时时间
    // withCredentials: true
})

// 异常拦截处理器
const errorHandler = (error) => {
    if (error.response) {
        const data = error.response.data
        if (!data.message) {
            Notify({ type: 'danger', message: data });
        } else {
            Notify({ type: 'danger', message: data.message });
        }
        
    }
    return Promise.reject(error)
}

// request interceptor
request.interceptors.request.use(config => {
    // const token = storage.get(ACCESS_TOKEN)
    // // 如果 token 存在
    // // 让每个请求携带自定义 token 请根据实际情况自行修改
    // if (token) {
    //     config.headers['Access-Token'] = token
    // }
    // if (process.env.VUE_APP_BASE_URL !== '') {
    //     config.url += process.env.VUE_APP_BASE_URL;
    // }
    return config
}, errorHandler)

// response interceptor
request.interceptors.response.use((response) => {
    return response.data
}, errorHandler)

export default request
