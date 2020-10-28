import React, { Component } from 'react'
import HmSearchBar from 'components/HmSearchBar'
import styles from './index.module.scss'
import Filter from './Filter/index'
import { requestHouseList } from 'api/map'
import { getCurrentCity } from 'utils/city'
import HmHouseItem from 'components/HmHouseItem'
import HmSticky from 'components/HmSticky'
import { List, AutoSizer, WindowScroller, InfiniteLoader } from 'react-virtualized'
import { Toast } from 'antd-mobile'

export default class House extends Component {
    state = {
        // filters: {}
        houseList: [],
        // 房屋总数
        count: -1
    }

    async componentDidMount() {
        // 获取当前城市
        const city = await getCurrentCity()
        // 将当前城市存储到this上
        this.cityId = city.value
        // 发送请求获取房屋信息
        this.getHouseList()

    }

    // 获取房屋列表的函数
    async getHouseList(start = 1, end = 30) {
        // 轻提示
        Toast.loading('加载中', 0)
        // 加载时候禁止滚动
        document.body.style.overflow = 'hidden'
        const res = await requestHouseList(this.cityId, { ...this.filters, start, end })
        console.log(res);
        // 讲房屋数据存储到state中
        if (res.status === 200) {
            this.setState({
                houseList: [...this.state.houseList, ...res.body.list],
                count: res.body.count
            })
        }
        Toast.hide()
        // 加载完成时候允许滚动
        document.body.style.overflow = ''
        if (start === 1) {
            Toast.info(`共找到${res.body.count}套房源`, 1)
        }
    }

    // 获取删选值
    onFilter = (selectedValues) => {
        const params = this.handleFilter(selectedValues)
        console.log(params);
        // 将params存储到this上
        this.filters = params
        // 点确定按钮重新发送数据
        this.setState({
            houseList: [],
            count: -1
        }, () => { this.getHouseList() })
        // 获取城市列表数据
        // this.getHouseList()
    }

    // 处理筛选条件
    handleFilter = (selectedValues) => {
        const params = {}
        params.rentType = selectedValues.mode[0]
        params.price = selectedValues.price[0]
        params.more = selectedValues.more.join()
        // 判断是subway还是area
        const area = selectedValues.area
        if (area.length === 3 && area[2] !== 'null') {
            params[area[0]] = area[2]
        } else {
            params[area[0]] = area[1]
        }
        return params
    }

    rowRenderer = ({ key, index, style, isScrolling }) => {
        const item = this.state.houseList[index]
        // 如果有值返回房屋列表 如果没值返回一个占位的div
        if (!item) {
            // 占位的div
            return <div key={key} style={style} className='palceholder'>
                <p></p>
            </div>
        }
        return (
            <HmHouseItem
                key={key}
                style={style}
                house={this.state.houseList[index]}
            ></HmHouseItem>
        )
    }

    loadMoreRows = async ({ startIndex, stopIndex }) => {
        // console.log('需要加载更多数据了', startIndex, stopIndex)
        // try {
        //   const res = await this.getHouseList(startIndex, stopIndex)
        //   return Promise.resolve(res)
        // } catch (err) {
        //   return Promise.reject(err)
        // }
        return this.getHouseList(startIndex + 1, stopIndex + 1)
    }
    // 判断看不到的下标是否有数据
    isRowLoaded = ({ index }) => {
        // index看不见的下标
        // console.log(index)
        return !!this.state.houseList[index]
    }

    renderHouse = () => {
        const { count } = this.state
        if (count === 0) {
            return <div>暂无房源</div>
        } else if (count < 0) {
            return null
        }

        return <InfiniteLoader
            isRowLoaded={this.isRowLoaded}
            loadMoreRows={this.loadMoreRows}
            rowCount={this.state.count}
            minimumBatchSize={30}
        >
            {({ onRowsRendered }) => (
                <WindowScroller>
                    {({ height, isScrolling, onChildScroll, scrollTop }) => (
                        <AutoSizer>
                            {({ width }) => (
                                <List
                                    onRowsRendered={onRowsRendered}
                                    onScroll={onChildScroll}
                                    autoHeight
                                    width={width}
                                    height={height}
                                    rowCount={this.state.count}
                                    rowHeight={120}
                                    rowRenderer={this.rowRenderer}
                                    isScrolling={isScrolling}
                                    scrollTop={scrollTop}
                                />
                            )}
                        </AutoSizer>
                    )}
                </WindowScroller>
            )}
        </InfiniteLoader>
    }

    render() {
        return (
            <div className={styles.houseList}>
                <div className="header">
                    <span className='iconfont icon-back'></span>
                    <HmSearchBar className='search' style={{ marginLeft: -10 }}>上海</HmSearchBar>
                </div>
                {/* Filter组件 */}
                {/* Filter组件做吸顶效果 */}
                <HmSticky>
                    <Filter onFilter={this.onFilter}></Filter>
                </HmSticky>
                {/* 渲染房屋列表 */}
                {/* {this.state.houseList.map(item => (
                    <HmHouseItem house={item} key={item.houseCode}></HmHouseItem>
                ))} */}
                {/* 使用长列表渲染房屋列表 */}
                {this.renderHouse()}
            </div>
        )
    }
}
