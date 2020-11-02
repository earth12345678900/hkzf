import axios from './axios'

// 房屋查询条件
export function requestCondition(id) {
    return axios.get('/houses/condition', {
        params: {
            id: id
        }
    })
}

export function requestHouseDetail(id) {
    return axios.get('/houses/' + id)
}

// 判断是否收藏
export function requestCheckFavorite(id) {
    return axios.get(`/user/favorites/${id}`)
}

// 添加收藏
export function requestAddFavorite(id) {
    return axios.post(`/user/favorites/${id}`)
}

// 删除收藏
export function requestDelFavorite(id) {
    return axios.delete(`/user/favorites/${id}`)
}

// 收藏列表
export function requestFavoriteList() {
    return axios.get('/user/favorites')
}

// 出租的列表
export function requestRentList() {
    return axios.get('/user/houses')
}

// 获取小区列表
export function reqCommunityList(id, name) {
    return axios.get('/area/community', {
        params: {
            id,
            name
        }
    })
}

// 上传图片
export function upLoadHouseImage(fd) {
    return axios({
        method: 'post',
        url: '/houses/image',
        data: fd
    })
}

// 发布房源
export function addHouse(data) {
    return axios({
        method: 'post',
        url: 'user/houses',
        data
    })
}







