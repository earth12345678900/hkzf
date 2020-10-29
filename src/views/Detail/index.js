import React, { Component } from 'react'
import styles from './index.module.scss'
import { requestHouseDetail } from 'api/house'
import { Carousel, Flex, Modal } from 'antd-mobile'
import { BASE_URL } from 'utils/config'
import HmNavBar from 'components/HmNavBar'
import classNames from 'classnames'
import HmHousePacility from 'components/HmHousePacility'
import HmHouseItem from 'components/HmHouseItem'

const { BMap } = window

// 猜你喜欢
const recommendHouses = [
    {
        id: 1,
        houseImg: '/img/news/1.png',
        desc: '72.32㎡/南 北/低楼层',
        title: '安贞西里 3室1厅',
        price: 4500,
        tags: ['随时看房']
    },
    {
        id: 2,
        houseImg: '/img/news/2.png',
        desc: '83㎡/南/高楼层',
        title: '天居园 2室1厅',
        price: 7200,
        tags: ['近地铁']
    },
    {
        id: 3,
        houseImg: '/img/news/3.png',
        desc: '52㎡/西南/低楼层',
        title: '角门甲4号院 1室1厅',
        price: 4300,
        tags: ['集中供暖']
    }
]

export default class Detail extends Component {
    state = {
        detail: ''
    }
    render() {
        const { detail } = this.state
        if (!detail) return null
        return (
            <div className={styles.detail} >
                {/* 导航栏 */}
                <HmNavBar
                    className='navBar1'
                    rightContent={[<span className="iconfont icon-share" key={0}></span>]}
                >
                    {detail.community}
                </HmNavBar>
                {/* 轮播图 */}
                < div className="slides" >
                    {/* 轮播图 */}
                    < Carousel autoplay infinite>
                        {
                            detail.houseImg.map((item) => (
                                <img
                                    key={item}
                                    src={BASE_URL + item}
                                    alt=""
                                    style={{ width: '100%', verticalAlign: 'top' }}
                                    onLoad={() => {
                                        // fire window resize event to change height
                                        window.dispatchEvent(new Event('resize'))
                                        this.setState({ imgHeight: 'auto' })
                                    }}
                                />
                            ))
                        }
                    </Carousel >
                </div >
                {/* 房屋信息 */}
                <div className="info">
                    <h3 className="infoTitle">{detail.title}</h3>
                    <Flex className="tags">
                        <Flex.Item>
                            {detail.tags.map((item, index) => (
                                <span key={item} className={classNames('tag', 'tag' + ((index % 3) + 1))}>{item}</span>
                            ))}
                        </Flex.Item>
                    </Flex>

                    <Flex className="infoPrice">
                        <Flex.Item className="infoPriceItem">
                            <div>
                                {detail.price}
                                <span className="month">/月</span>
                            </div>
                            <div>租金</div>
                        </Flex.Item>
                        <Flex.Item className="infoPriceItem">
                            <div>{detail.roomType}</div>
                            <div>房型</div>
                        </Flex.Item>
                        <Flex.Item className="infoPriceItem">
                            <div>{detail.size}平米</div>
                            <div>面积</div>
                        </Flex.Item>
                    </Flex>

                    <Flex className="infoBasic" align="start">
                        <Flex.Item>
                            <div>
                                <span className="title">装修：</span>
                                精装
                            </div>
                            <div>
                                <span className="title">楼层：</span>
                                {detail.floor}
                            </div>
                        </Flex.Item>
                        <Flex.Item>
                            <div>
                                <span className="title">朝向：</span>
                                {detail.oriented[0]}
                            </div>
                            <div>
                                <span className="title">类型：</span>普通住宅
                            </div>
                        </Flex.Item>
                    </Flex>
                </div>


                {/* 地图位置 */}
                <div className="map">
                    <div className="mapTitle">
                        小区：
                        <span>{detail.community}</span>
                    </div>
                    <div className="mapContainer" id="map">
                        地图
                    </div>
                </div>

                {/* 房屋配套 */}
                <div className="about">
                    <div className="houseTitle">房屋配套</div>
                    {detail.supporting.length === 0 ? (
                        <div className="titleEmpty">暂无数据</div>
                    ) : (
                            <HmHousePacility supporting={detail.supporting} />
                        )}
                </div>


                {/* 房屋概况 */}
                <div className="set">
                    <div className="houseTitle">房源概况</div>
                    <div>
                        <div className="contact">
                            <div className="user">
                                <img src={BASE_URL + '/img/avatar.png'} alt="头像" />
                                <div className="useInfo">
                                    <div>王女士</div>
                                    <div className="userAuth">
                                        <i className="iconfont icon-auth" />
                                        已认证房主
                                    </div>
                                </div>
                            </div>
                            <span className="userMsg">发消息</span>
                        </div>

                        <div className="descText">
                            {detail.description || '暂无房屋描述'}
                        </div>
                    </div>
                </div>

                {/* 推荐 */}
                <div className="recommend">
                    <div className="houseTitle">猜你喜欢</div>
                    <div className="items">
                        {recommendHouses.map((item) => (
                            <HmHouseItem house={item} key={item.id} />
                        ))}
                    </div>
                </div>

                {/* 底部收藏按钮 */}
                <Flex className="fixedBottom">
                    <Flex.Item onClick={this.handleFavorite}>
                        <img
                            src={BASE_URL + '/img/unstar.png'}
                            className="favoriteImg"
                            alt="收藏"
                        />
                        <span className="favorite">收藏</span>
                    </Flex.Item>
                    <Flex.Item>在线咨询</Flex.Item>
                    <Flex.Item>
                        <a href="tel:400-618-4000" className="telephone">
                            电话预约
                        </a>
                    </Flex.Item>
                </Flex>
            </div>
        )
    }

    async componentDidMount() {
        // 房屋具体信息
        await this.getHouseDetail()
        // 渲染地图
        this.initMap()
    }

    initMap = () => {
        const { coord, community } = this.state.detail
        // 初始化地图
        const map = new BMap.Map('map')
        // 获取中心点
        const point = new BMap.Point(coord.longitude, coord.latitude)
        // 
        map.centerAndZoom(point, 15)
        // 设置label标签
        const label = new BMap.Label(`
            <span>${community}</span>
            <div class="mapArrow"></div>
          `,
            {
                position: point,
                offset: new BMap.Size(-60, -30) //设置偏移
            }
        )
        label.setStyle({
            position: 'absolute',
            backgroundColor: 'rgb(238, 93, 91)',
            color: 'rgb(255, 255, 255)',
            height: 25,
            padding: '5px 10px',
            lineHeight: '14px',
            borderRadius: 3,
            boxShadow: 'rgb(204, 204, 204) 2px 2px 2px',
            whiteSpace: 'nowrap',
            fontSize: 12,
            userSelect: 'none'
        })
        // 创建覆盖物
        map.addOverlay(label)
    }

    async getHouseDetail() {
        const { id } = this.props.match.params
        console.log(id);
        const res = await requestHouseDetail(id)
        console.log(res);
        if (res.status === 200) {
            this.setState({
                detail: res.body
            })
        }
    }

    handleFavorite = () => {
        // 弹窗跳转到登陆
        Modal.alert('温馨提示', '登录后才能收藏房源，是否去登陆', [
            { text: '取消' },
            // 按确定跳转到登陆页面
            { text: '确定', onPress: () => { this.props.history.push('/login') } }
        ])
    }
}
