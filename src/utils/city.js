// 获取当前定位的城市
/*
思路
1.优先从缓存中获取当前城市
2.有当前城市 说明之前定位的   用户选择的城市 直接用这个城市
3.没有当前城市 使用百度地图定位 发送请求获取当前城市 存储到缓存中
 */

// 基于回调函数的封装
// import { requestCityInfo } from 'api/home'
// const { BMap } = window
// const KEY = 'current_city'
// // 1.使用回调函数解决异步问题
// export function getCurrentCity(callback) {
//     const city = localStorage.getItem(KEY)
//     if (city) {
//         // 缓存中有
//         return callback(city)
//     }
//     // 缓存中没有  使用百度地图定位
//     //获取当前城市
//     var myCity = new BMap.LocalCity();
//     myCity.get(async (result) => {
//         const res = await requestCityInfo(result.name)
//         // 存储到缓存中
//         if (res.status === 200) {
//             localStorage.setItem(KEY, JSON.stringify(res.body))
//             callback(res.body)
//         }
//         console.log(res);
//     })
// }



// Promise 封装 + 回调函数
import { requestCityInfo } from 'api/city'
const { BMap } = window
const KEY = 'current_city'
// 1.使用回调函数解决异步问题
export function getCurrentCity(callback) {
    const city = JSON.parse(localStorage.getItem(KEY))
    if (city) {
        // 缓存中有
        callback && callback(city)
        return new Promise(resolve => resolve(city))
    }
    // 缓存中没有  使用百度地图定位
    //获取当前城市
    return new Promise((resolve, reject) => {
        var myCity = new BMap.LocalCity();
        myCity.get((result) => {
            requestCityInfo(result.name)
                .then(res => {
                    // console.log(res, '-----------');
                    localStorage.setItem(KEY, JSON.stringify(res.body))
                    callback && callback(res.body)
                    resolve(res.body)
                })
                .catch(err => {
                    reject(err)
                })
        })
    })
}


export function setCurrentCity(city) {
    localStorage.setItem(KEY, JSON.stringify(city))
}