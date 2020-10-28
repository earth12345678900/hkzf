import React from 'react'
import FilterFooter from '../FilterFooter'
import styles from './index.module.scss'
import classNames from 'classnames'
import { Spring } from 'react-spring/renderprops'

class FilterMore extends React.Component {

    state = {
        // 储存点击了哪个按钮
        list: this.props.defaultValues
    }

    onClick = (value) => {
        // 判断list中是否包含点击的按钮 点击过了就删除 没点击过就添加
        let arr = this.state.list.slice()
        if (arr.includes(value)) {
            arr = arr.filter(item => item !== value)
        } else {
            arr.push(value)
        }
        // 重新设置list的值
        this.setState({
            list: arr
        })
    }

    // 渲染span
    renderTag(data) {
        return data.map(item => (
            // tag-active 高亮
            <span
                className={classNames('tag', { 'tag-active': this.state.list.includes(item.value) })}
                key={item.value}
                // 注册点击事件
                onClick={() => { this.onClick(item.value) }}
            >
                {item.label}
            </span>
        ))
    }



    render() {
        const {
            onCancel,
            characteristic = [],
            floor = [],
            oriented = [],
            roomType = [],
            onConfirm,
            openType
        } = this.props
        return (
            <div className={styles['filter-more']}>
                {/* 遮罩层 */}
                {/* 遮罩层加动画 */}
                <Spring to={{ opacity: openType === 'more' ? 1 : 0 }}>
                    {
                        (props) => {
                            if (props.opacity === 0) {
                                return null
                            }
                            return <div style={props} className="mask" onClick={onCancel} />
                        }
                    }
                </Spring>
                {/* 条件内容 */}
                {/* 加动画 */}
                <Spring to={{ transform: openType === 'more' ? 'translateX(0)' : 'translateX(100%)' }}>
                    {(props) => {
                        return (
                            <>
                                <div className="tags" style={props}>
                                    <dl className="dl">
                                        <dt className="dt">户型</dt>
                                        <dd className="dd">
                                            {this.renderTag(roomType)}
                                        </dd>

                                        <dt className="dt">朝向</dt>
                                        <dd className="dd">
                                            {this.renderTag(oriented)}
                                        </dd>

                                        <dt className="dt">楼层</dt>
                                        <dd className="dd">
                                            {this.renderTag(floor)}
                                        </dd>

                                        <dt className="dt">房屋亮点</dt>
                                        <dd className="dd">
                                            {this.renderTag(characteristic)}
                                        </dd>
                                    </dl>
                                </div>

                                {/* 底部的按钮 */}
                                <FilterFooter
                                    style={props}
                                    className='filter-footer'
                                    cancelText={'清除'}
                                    // 传递给Footer组件的清除按钮 将所有高亮变为不高亮
                                    onCancel={() => this.setState({ list: [] })}
                                    onConfirm={() => onConfirm(this.state.list)}
                                ></FilterFooter>
                            </>
                        )
                    }}
                </Spring>
            </div>
        )
    }
}

export default FilterMore