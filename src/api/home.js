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