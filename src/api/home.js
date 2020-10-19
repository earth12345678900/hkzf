// 导入自己封装的axios
import axios from './axios'

// 首页轮播图
export function requestSwiperList() {
    return axios.get('/home/swiper')
}

// 租房小组
export function requestGroups(area) {
    return axios.get('/home/groups', {
        params: {
            area: area
        }
    })
}

// 最新资讯
export function requestNewsList(area) {
    return axios.get('/home/news', {
        params: {
            area: area
        }
    })
}

//  根据城市名称查询该城市信息
export function requestCityInfo(name) {
    return axios.get('/area/info', {
        params: {
            name: name
        }
    })
}