import React, { Component } from 'react'
import HmNavBar from 'components/HmNavBar/index'
import './index.scss'
import { requestHotCity, requestCityList } from 'api/home'
import { getCurrentCity, setCurrentCity } from 'utils/city'
import { List, AutoSizer } from 'react-virtualized';
import { Toast } from 'antd-mobile'


// List data as an array of strings
// const list = [
//     'Brian Vaughn',
//     // And so on...
// ];

// function rowRenderer({
//     key, // Unique key within array of rows
//     index, // Index of row within collection
//     isScrolling, // The List is currently being scrolled
//     isVisible, // This row is visible within the List (eg it is not an overscanned row)
//     style, // Style object to be applied to row (to position it)
// }) {
//     return (
//         <div key={key} style={style}>
//             {list[index]}
//         </div>
//     );
// }

export default class City extends Component {
    constructor(props) {
        super(props)
        this.state = {
            cityObj: {},
            cityList: [],
            currentIndex: 0
        }
        this.listRef = React.createRef()
    }


    componentDidMount() {
        this.getCityList()
    }

    async getCityList() {
        // 数据加载前给轻提示
        Toast.loading('加载中', 0)
        const res = await requestCityList()
        console.log(res);
        if (res.status === 200) {
            const { cityObj, cityList } = this.resolveCityList(res.body)
            // 获取热门城市的数据
            const res1 = await requestHotCity()
            cityList.unshift('hot')
            cityObj['hot'] = res1.body
            // 获取当前定位的城市
            /* 
            思路
            1.优先从缓存中获取当前城市
            2.有当前城市 说明之前定位的   用户选择的城市 直接用这个城市
            3.没有当前城市 使用百度地图定位 发送请求获取当前城市 存储到缓存中
             */
            cityList.unshift('#')
            // 从内存获取当前城市 
            // cityObj['#'] = [JSON.parse(localStorage.getItem('current_city'))]
            // 调用方法获取当前城市
            // const city = getCurrentCity()
            // 使用回调函数得到当前城市
            // getCurrentCity(city => {
            //     console.log(city);
            //     console.log(cityObj, cityList);
            // })

            // 基于Promise使用 得到定位的城市
            const city = await getCurrentCity()
            cityObj['#'] = [city]
            console.log(city);
            this.setState({
                cityObj: cityObj,
                cityList: cityList
            }, () => {
                // 第一次渲染list时候 提前测量室友行的高度 确保切换准确
                this.listRef.current.measureAllRows()
            })
        }

        // 数据回来前隐藏
        Toast.hide()
    }

    // 处理城市列表数据
    /* 
    思路
    1.准备空对象
    2.遍历数组
    3.获取数组中的对象的short的第一个字符 转大写
    4.判断这个对象是否包含这个属性
    5.不包含 添加这个属性obj['A'] = [对象]
    6.包含 obj['A'].push(对象)
    */
    resolveCityList(list) {
        const cityObj = {}
        list.forEach(item => {
            const key = item.short[0].toUpperCase()
            if (cityObj.hasOwnProperty(key)) {
                // 有
                cityObj[key].push(item)
            } else {
                //没有
                cityObj[key] = [item]
            }
        });
        // 对该对象的键 排序
        const cityList = Object.keys(cityObj).sort()
        return { cityObj, cityList }
    }

    // 处理遍历出来的title
    resolveTitle(title) {
        if (title === '#') return '当前城市'
        else if (title === 'hot') return '热门城市'
        else return title
    }


    selectCity = (city) => {
        // console.log(city);
        if (['北京', '上海', '广州', '深圳'].includes(city.label)) {
            // 将城市存储到localstorage中(调用封装的方法)
            setCurrentCity(city)
            // 跳回到首页
            this.props.history.goBack()
        } else {
            Toast.info('该城市暂无房源', 1)
        }
    }


    rowRenderer = ({
        key, // Unique key within array of rows
        index, // Index of row within collection
        style, // Style object to be applied to row (to position it)
    }) => {
        const { cityList, cityObj } = this.state
        let title = cityList[index]
        return (
            <div key={key} style={style} className='row'>
                <div className='title'>{this.resolveTitle(title)}</div>
                {
                    cityObj[title].map(item => (
                        <div className='name' key={item.value} onClick={this.selectCity.bind(this, item)}>{item.label}</div>
                    ))
                }
            </div>
        );
    }

    rowHeight = ({ index }) => {
        const { cityList, cityObj } = this.state
        let key = cityList[index]
        let height = 36 + cityObj[key].length * 50
        return height
    }

    onRowsRendered = ({ startIndex }) => {
        if (startIndex !== this.state.currentIndex) {
            this.setState({
                currentIndex: startIndex
            })
        }
    }

    scrollToRow = (index) => {
        this.listRef.current.scrollToRow(index)
    }

    render() {
        const { cityList, currentIndex } = this.state
        return (
            <div className='city'>
                <HmNavBar>城市列表</HmNavBar>

                {/* <div className="content">
                    {
                        this.state.cityList.map(item => {
                            return (
                                <div className="row" key={item}>
                                    <div className="title">{item}</div>
                                    <ul>
                                        {
                                            this.state.cityObj[item].map(item => {
                                                return (
                                                    <li key={item.value}>{item.label}</li>
                                                )
                                            })
                                        }
                                    </ul>
                                </div>
                            )
                        })
                    }
                </div> */}

                {/* 使用长列表渲染 */}
                {/* AutoSizer 自动做宽高的适配 */}
                <AutoSizer>
                    {
                        ({ height, width }) => (
                            <List
                                ref={this.listRef}
                                width={width}
                                height={height}
                                rowCount={cityList.length}
                                rowHeight={this.rowHeight}
                                rowRenderer={this.rowRenderer}
                                onRowsRendered={this.onRowsRendered}
                                scrollToAlignment='start'
                            />
                        )
                    }
                </AutoSizer>

                {/* 右侧城市索引列表： */}
                <ul className="city-index">
                    {
                        cityList.map((item, index) =>
                            (<li className="city-index-item" key={item} onClick={() => { this.scrollToRow(index) }}>
                                <span className={index === currentIndex ? 'index-active' : ''}>{item === 'hot' ? '热' : item}</span>
                            </li>)
                        )
                    }
                </ul>

            </div>
        )
    }
}
