import React, { Component } from 'react'
import HmNavBar from 'components/HmNavBar'
import styles from './index.module.scss'
import { requestChildCity, requestHouseList } from 'api/map'
import { getCurrentCity } from 'utils/city'
import { Toast } from 'antd-mobile'
import { BASE_URL } from 'utils/config'
import classNames from 'classnames'

const { BMap } = window

export default class Map extends Component {
    state = {
        isShowHouse: false,
        houseList: []
    }

    componentDidMount() {
        this.initMap()
    }

    async initMap() {
        // 获取当前城市
        const city = await getCurrentCity()
        // 创建百度地图地址解析器
        var myGeo = new BMap.Geocoder();
        // 解析当前城市
        myGeo.getPoint(city.label, (point) => {
            // 根据point 创建地图并居中
            const map = new BMap.Map('map')
            // 把map挂载到Map上
            this.map = map
            map.centerAndZoom(point, 11);
            // 地图控件
            map.addControl(new BMap.NavigationControl());
            map.addControl(new BMap.ScaleControl());

            // 增加覆盖物
            this.renderOverlays(city.value)


            // 给地图增加移动事件 移动地图 房屋列表隐藏
            this.map.addEventListener('movestart', () => {
                this.setState({
                    isShowHouse: false
                })
            })
        }, city.label);
    }

    // 渲染覆盖物
    async renderOverlays(id) {
        Toast.loading('加载中', 0)
        // 获取覆盖物级别和一下次缩放比例
        const { type, nextZoom } = this.getTypeAndZoom()
        //    获得子级城市
        const res = await requestChildCity(id)
        if (res.status === 200) {
            res.body.forEach(item => {
                this.addOverlay(item, type, nextZoom)
            });
        }
        // 加载完成取出轻提示
        Toast.hide()
    }

    // 判断创建什么类型的覆盖物
    addOverlay(item, type, nextZoom) {
        // console.log(11);
        // 如果是type是圆 创建圆形覆盖物  如果是rect 创建方形覆盖物
        if (type === 'circle') {
            this.createCircle(item, nextZoom)
        } else {
            this.createRect(item)
        }
    }

    // 获取当前覆盖物类型和下一次缩放级别
    getTypeAndZoom() {
        // 获取当前地图缩放级别
        // map挂载到Map上了
        // 获取到当前的级别
        const zoom = this.map.getZoom()
        // console.log(zoom);
        let type, nextZoom
        if (zoom === 11) {
            type = 'circle'
            nextZoom = 13
        } else if (zoom === 13) {
            type = 'circle'
            nextZoom = 15
        } else {
            type = 'rect'
            nextZoom = 15
        }
        return { type, nextZoom }
    }

    // 创建圆形覆盖物
    createCircle(item, nextZoom) {
        const point = new BMap.Point(item.coord.longitude, item.coord.latitude)
        let label = new BMap.Label(`
        <div class="bubble">
            <p class="name">${item.label}</p>
            <p>${item.count}套</p>
        </div>
      `, {
            position: point,    // 指定文本标注所在的地理位置
            offset: new BMap.Size(30, -30)    //设置文本偏移量
        });  // 创建文本标注对象

        label.setStyle({
            border: 'none',
            padding: 0
        });
        // 添加覆盖物
        this.map.addOverlay(label);
        // 覆盖物添加点击事件
        label.addEventListener('click', () => {
            //清除所有覆盖物
            // 防止控制台报错
            setTimeout(() => {
                this.map.clearOverlays()
            }, 0);
            // 重新设置坐标点
            this.map.centerAndZoom(point, nextZoom)
            // 渲染下一级
            console.log(item);
            this.renderOverlays(item.value)
        })
    }

    // 创建方形覆盖物
    createRect(item) {
        const point = new BMap.Point(item.coord.longitude, item.coord.latitude)
        let label = new BMap.Label(`
        <div class="rect">
        <span class="housename">${item.label}</span>
            <span class="housenum">${item.count} 套</span>
            <i class="arrow"></i>
        </div>
        `, {
            position: point,    // 指定文本标注所在的地理位置
            offset: new BMap.Size(-50, -22)    //设置文本偏移量
        })
        label.setStyle({
            border: 'none',
            padding: 0
        });
        // 添加覆盖物
        this.map.addOverlay(label);
        // 覆盖物添加点击事件
        label.addEventListener('click', (e) => {
            Toast.loading('加载中', 0)
            // 重新设置坐标点 将点击的房源信息移动到屏幕中心
            const { pageX, pageY } = e.changedTouches[0]
            const x = window.innerWidth / 2 - pageX
            const y = (window.innerHeight - 45 - 330) / 2 + 45 - pageY
            // this.map.centerAndZoom(point, 15)
            //将地图移到中心点
            this.map.panBy(x, y)
            // 发送请求获取房源信息
            // 百度地图不支持async
            requestHouseList(item.value).then(res => {
                // 显示房屋列表
                this.setState({
                    isShowHouse: true,
                    houseList: res.body.list
                })
                // 没有async await 放到.then中隐藏
                Toast.hide()
            })

        })
    }

    render() {
        return (
            <div className={styles.map}>
                <HmNavBar>地图找房</HmNavBar>
                {/* 渲染地图的容器 */}
                <div id="map" className='map'></div>
                {/* 房屋列表 */}
                <div className={classNames('houseList', { show: this.state.isShowHouse })}>
                    <div className="titleWrap">
                        <h1 className="listTitle">房屋列表</h1>
                        <a className="titleMore" href="/house/list">
                            更多房源
                        </a>
                    </div>
                    <div className="houseItems">
                        {
                            this.state.houseList.map(item => (<div className="house" key={item.houseCode}>
                                <div className="imgWrap">
                                    <img
                                        className="img"
                                        src={BASE_URL + item.houseImg}
                                        alt=""
                                    />
                                </div>
                                <div className="content">
                                    <h3 className="title">
                                        {item.title}
                                    </h3>
                                    <div className="desc">{item.desc}</div>
                                    <div>
                                        {
                                            item.tags.map((tag, index) => <span className={classNames('tag', 'tag' + ((index % 3) + 1))} key={tag}>{tag}</span>)
                                        }
                                    </div>
                                    <div className="price">
                                        <span className="priceNum">{item.price}</span> 元/月
                                     </div>
                                </div>
                            </div>))
                        }
                    </div>
                </div>
            </div>
        )
    }
}
