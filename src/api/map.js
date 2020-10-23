// 导入自己封装的axios
import axios from './axios'

export function requestChildCity(id) {
    return axios.get('/area/map', {
        params: {
            id
        }
    })
}

// 获取房屋具体信息
export function requestHouseList(id) {
    return axios.get('/houses', {
        params: {
            cityId: id
        }
    })
}