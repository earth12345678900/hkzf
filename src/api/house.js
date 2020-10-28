import axios from './axios'

// 房屋查询条件

export function requestCondition(id) {
    return axios.get('/houses/condition', {
        params: {
            id: id
        }
    })
}