import axios from 'axios'
import { BASE_URL } from '../utils/config'

// axios的封装
const instance = axios.create({
    baseURL: BASE_URL
})

// 配置响应拦截器
instance.interceptors.response.use((res) => {
    return res.data
})

export default instance