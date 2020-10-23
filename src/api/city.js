//  根据城市名称查询该城市信息
// 导入自己封装的axios
import axios from './axios'

export function requestCityInfo(name) {
    return axios.get('/area/info', {
        params: {
            name: name
        }
    })
}

// 获取城市列表数据
export function requestCityList(level = 1) {
    return axios.get('/area/city', {
        params: {
            level: level
        }
    })
}

// 获取热门城市
export function requestHotCity() {
    return axios.get('/area/hot')
}