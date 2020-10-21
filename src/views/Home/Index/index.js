import React, { Component } from 'react'
import { Carousel, Flex, Grid } from 'antd-mobile';
// import axios from 'axios'
// 导入自己封装的axios
// import axios from '../../../api/axios'
// 配置了绝对路径
// import axios from 'api/axios'
// 导入二次封装的方法
import { requestNewsList, requestGroups, requestSwiperList, requestCityInfo } from 'api/home'
import './index.scss'
import { BASE_URL } from 'utils/config'
import img1 from 'images/nav-1.png'
import img2 from 'images/nav-2.png'
import img3 from 'images/nav-3.png'
import img4 from 'images/nav-4.png'
import { getCurrentCity } from 'utils/city';

const navList = [
    { title: '整租', path: '/home/house', img: img1 },
    { title: '合租', path: '/home/house', img: img2 },
    { title: '地图找房', path: '/map', img: img3 },
    { title: '去出租', path: '/rent', img: img4 }
]

// const { BMap } = window

export default class Index extends Component {
    state = {
        swiperList: [],
        groupList: [],
        newsList: [],
        city: {},
        imgHeight: (212 / 375) * window.innerWidth,
    }
    async componentDidMount() {
        // 获取当前城市
        const city = await getCurrentCity()
        this.setState({
            city: city
        }, () => {
            // 需要得到城市的信息后才能渲染 所以放在setstate的回调函数里
            this.getSwiperList()
            this.getGroupList()
            this.getNewsList()
        })
        // 放setState的回调函数里
        // this.getSwiperList()
        // this.getGroupList()
        // this.getNewsList()

        // //获取当前城市
        // var city = new BMap.LocalCity();
        // // 根据定位的城市发送请求 获取城市的信息
        // city.get(async (result) => {
        //     const res = await requestCityInfo(result.name)
        //     // console.log(res);
        //     if (res.status === 200) {
        //         // 讲当前定位的城市存在内存
        //         localStorage.setItem('current_city', JSON.stringify(res.body))
        //         this.setState({
        //             city: res.body
        //         }, () => {
        //             // 需要得到城市的信息后才能渲染 所以放在setstate的回调函数里
        //             this.getSwiperList()
        //             this.getGroupList()
        //             this.getNewsList()
        //         })
        //     }
        // });
    }

    // 获取轮播图数据
    async getSwiperList() {
        // 用自己封装的axios
        // const res = await axios(BASE_URL + '/home/swiper')
        // const res = await axios('/home/swiper')
        const res = await requestSwiperList()
        // console.log(res.data);
        // 配置了拦截器
        // const { body, status } = res.data
        const { body, status } = res
        if (status === 200) {
            this.setState({
                swiperList: body
            })
        }
    }

    // 获取租房小组数据
    async getGroupList() {
        // 租房小组
        const res = await requestGroups(this.state.city.value)
        console.log(res);
        if (res.status === 200) {
            this.setState({
                groupList: res.body
            })
        }
    }

    // 获取资讯列表
    async getNewsList() {
        const { status, body } = await requestNewsList(this.state.city.value)
        if (status === 200) {
            this.setState({
                newsList: body
            })
        }
    }

    // 渲染轮播图的函数
    renderSwiper() {
        if (this.state.swiperList.length > 0) {
            return <Carousel
                autoplay={true}
                infinite
                autoplayInterval={1000}
            >
                {this.state.swiperList.map(item => (
                    <a
                        key={item.id}
                        href={item.imgSrc}
                        style={{ display: 'inline-block', width: '100%', height: this.state.imgHeight }}
                    >
                        <img
                            src={BASE_URL + item.imgSrc}
                            alt={item.alt}
                            style={{ width: '100%', verticalAlign: 'top' }}
                            onLoad={() => {
                                // fire window resize event to change height
                                window.dispatchEvent(new Event('resize'));
                                this.setState({ imgHeight: 'auto' });
                            }}
                        />
                    </a>
                ))}
            </Carousel>
        } else {
            return null
        }
    }



    // 渲染导航链接的函数
    renderNav() {
        return (
            <Flex>
                {navList.map((item) => {
                    return (
                        <Flex.Item key={item.title} onClick={() => this.props.history.push(item.path)}>
                            <img src={item.img} alt="" />
                            <p>{item.title}</p>
                        </Flex.Item>
                    )
                })}
            </Flex>
        )
    }

    // 租房小组
    renderGroup() {
        return <>
            <h3 className="group-title">
                租房小组
                <span className='more'>更多</span>
            </h3>
            <div className="group-content">
                {/* 九宫格组件 */}
                <Grid data={this.state.groupList}
                    columnNum={2}
                    square={false}
                    hasLine={false}
                    renderItem={item => (
                        <Flex className="group-item" justify="around">
                            <div className="desc">
                                <p className="title">{item.title}</p>
                                <span className="info">{item.desc}</span>
                            </div>
                            <img src={BASE_URL + item.imgSrc} alt="" />
                        </Flex>)
                    }
                />
            </div>
        </>

    }

    // 最新资讯
    renderNews() {
        return <>
            <h3 className="news-title">最新资讯</h3>
            {
                this.state.newsList.map(item =>
                    <div key={item.id} className="news-item">
                        <Flex className='content'>
                            <img
                                className="img"
                                src={BASE_URL + item.imgSrc}
                                alt=""
                            />
                            <Flex className="info" direction="column" justify="between">
                                <h3 className="title">
                                    {item.title}
                                </h3>
                                <Flex className="bottom" justify="between">
                                    <span>{item.from}</span>
                                    <span>{item.date}</span>
                                </Flex>
                            </Flex>
                        </Flex>
                    </div>
                )
            }
        </>
    }

    // 搜索框
    renderSearch() {
        return (
            <Flex className="search-box">
                <Flex className="search-form">
                    <div className="location" onClick={() => this.props.history.push('/city')}>
                        <span className="name">{this.state.city.label}</span>
                        <i className="iconfont icon-arrow"> </i>
                    </div>
                    <div className="search-input">
                        <i className="iconfont icon-seach" />
                        <span className="text">请输入小区地址</span>
                    </div>
                </Flex>
                {/* 地图小图标 */}
                <i className="iconfont icon-map" onClick={() => this.props.history.push('/map')} />
            </Flex>
        )
    }

    render() {
        return (
            <div className='index'>
                {/* 轮播图 */}
                {/* 给轮播图外面加盒子高度和轮播图高度一致 */}
                <div className='swiper' style={{ height: this.state.imgHeight }}>
                    {this.renderSwiper()}
                    {/* 搜索框 */}
                    {this.renderSearch()}
                </div>

                {/* 导航链接 */}
                <div className="nav"> {this.renderNav()}</div>

                {/* 租房小组 */}
                <div className="group"> {this.renderGroup()}</div>

                {/* 最新资讯 */}
                <div className="news">{this.renderNews()}</div>


            </div>
        )
    }
}
