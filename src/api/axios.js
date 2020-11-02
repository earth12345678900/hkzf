import axios from 'axios'
import { BASE_URL } from 'utils/config'
import { Toast } from 'antd-mobile'
import { getToken, removeToken } from 'utils/token'
const instance = axios.create({
    baseURL: BASE_URL
})

instance.interceptors.request.use((config) => {
    // console.log('config', config)
    const token = getToken()
    if (token) {
        config.headers.Authorization = token
    }
    return config
})

instance.interceptors.response.use((res) => {
    // console.log('res', res)
    if (res.data.status === 400 && res.data.description === 'token异常或者过期') {
        // 删除旧的token
        removeToken()
        // 给一个提示消息
        Toast.fail('token验证失败')
    }
    return res
})

instance.interceptors.response.use((res) => {
    // console.log('res', res)
    return res
})

// request做任何的配置，都不用担心会影响全局的axios
instance.interceptors.response.use((res) => {
    return res.data
})

export default instance
