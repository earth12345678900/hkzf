import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styles from './index.module.scss'
import classNames from 'classnames'

// 所有房屋配置项
const HOUSE_PACKAGE = [
    {
        id: 1,
        name: '衣柜',
        icon: 'icon-wardrobe'
    },
    {
        id: 2,
        name: '洗衣机',
        icon: 'icon-wash'
    },
    {
        id: 3,
        name: '空调',
        icon: 'icon-air'
    },
    {
        id: 4,
        name: '天然气',
        icon: 'icon-gas'
    },
    {
        id: 5,
        name: '冰箱',
        icon: 'icon-ref'
    },
    {
        id: 6,
        name: '暖气',
        icon: 'icon-Heat'
    },
    {
        id: 7,
        name: '电视',
        icon: 'icon-vid'
    },
    {
        id: 8,
        name: '热水器',
        icon: 'icon-heater'
    },
    {
        id: 9,
        name: '宽带',
        icon: 'icon-broadband'
    },
    {
        id: 10,
        name: '沙发',
        icon: 'icon-sofa'
    }
]

class HmHousePacility extends Component {
    static propTypes = {
        supporting: PropTypes.array,
        onSelect: PropTypes.func
    }
    state = {
        list: []
    }

    render() {
        const { supporting, onSelect } = this.props
        // console.log(this.props.supporting)
        let data
        // 如果有supporting显示传过来的数组 没有 显示所有数据
        if (supporting) {
            data = this.props.supporting.map((item) => {
                return HOUSE_PACKAGE.find((v) => v.name === item)
            })
        } else {
            data = HOUSE_PACKAGE
        }
        // console.log(data)
        return (
            <ul className={styles['house-package']}>
                {data.map((item) => (
                    // 数组中选中的值有高亮
                    <li key={item.id} className={classNames('item', { active: this.state.list.includes(item.name) })}>
                        {/* 有选择列表注册点击事件 否则不注册 */}
                        <p onClick={onSelect ? this.onClick.bind(this, item.name) : null}>
                            <i className={`iconfont icon ${item.icon}`} />
                        </p>
                        {item.name}
                    </li>
                ))}
            </ul>
        )
    }

    onClick = (name) => {
        // console.log(name);
        // 判断name是否在数组中 在:删除 不在：添加
        let arr = [...this.state.list]
        if (arr.includes(name)) {
            arr = arr.filter(item => item !== name)
        } else {
            arr.push(name)
        }
        this.setState({
            list: arr
        })
        this.props.onSelect(arr)
    }
}

export default HmHousePacility
