import React from 'react'
import { Flex } from 'antd-mobile'
import classNames from 'classnames'
import styles from './index.module.scss'

// 条件筛选栏标题数组：房屋筛选的条件分为4组
const titleList = [
    { title: '区域', type: 'area' },
    { title: '方式', type: 'mode' },
    { title: '租金', type: 'price' },
    { title: '筛选', type: 'more' },
]
class FilterTitle extends React.Component {

    render() {
        const { titleSelectStatus, onChange } = this.props
        return (
            <Flex align="center" className={styles['filter-title']}>
                {
                    titleList.map(item => (
                        <Flex.Item key={item.title} onClick={() => { onChange(item.type) }}>
                            {/* 选中类名： selected */}
                            <span
                                className={classNames('dropdown', { selected: titleSelectStatus[item.type] })}>
                                <span>{item.title}</span>
                                <i className="iconfont icon-arrow" />
                            </span>
                        </Flex.Item>
                    ))
                }
            </Flex>
        )
    }
}

export default FilterTitle