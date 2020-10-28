import React, { Component } from 'react'
import styles from './index.module.scss'

export default class HmSticky extends Component {
    constructor(props) {
        super(props)
        this.contentRef = React.createRef()
        this.placeRef = React.createRef()
    }
    render() {
        return (
            <div className={styles.sticky}>
                {/* 占位置的盒子 */}
                <div className="placeholder" ref={this.placeRef}></div>
                {/* 内容的盒子 */}
                <div className="content" ref={this.contentRef}>{this.props.children}</div>
            </div>
        )
    }

    componentDidMount() {
        document.addEventListener('scroll', this.onScroll)
    }

    componentWillUnmount() {
        document.removeEventListener('scroll', this.onScroll)
    }

    onScroll = () => {
        // 获取top值
        const rect = this.placeRef.current.getBoundingClientRect()
        const rect2 = this.contentRef.current.getBoundingClientRect()
        console.log(rect);
        if (rect.top <= 0) {
            // 让content固定定位
            this.contentRef.current.classList.add('fixed')
            // 让占位置的盒子一个高度 
            this.placeRef.current.style.height = rect2.height + 'px'
        } else {
            // 移除类名
            this.contentRef.current.classList.remove('fixed')
            this.placeRef.current.style.height = 0
        }
    }
}
