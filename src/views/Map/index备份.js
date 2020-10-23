import React, { Component } from 'react'
import './index.scss'
const { BMap, BMAP_STATUS_SUCCESS } = window

export default class Map extends Component {
    componentDidMount() {
        var geolocation = new BMap.Geolocation();
        var that = this
        console.log('that 是Map------------', that);
        geolocation.getCurrentPosition(function (r) {
            console.log('this是Geolocation============', this);
            if (this.getStatus() === BMAP_STATUS_SUCCESS) {
                const { lng, lat } = r.point
                that.initMap(lng, lat)
            }
            else {
                that.initMap()
            }
        });
    }


    // 初始化地图
    initMap(longitude = 121.60925843533574, latitude = 31.03719416026002) {
        // 创建地图实例
        var map = new BMap.Map("map");
        // 创建坐标点
        var point = new BMap.Point(longitude, latitude);
        var marker = new BMap.Marker(point);
        map.addOverlay(marker);
        map.centerAndZoom(point, 18);
    }


    render() {
        return (
            <div className="map" id="map">
                我是地图组件
            </div>
        )
    }
}
