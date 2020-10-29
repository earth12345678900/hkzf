import React, { Component } from 'react'
import { NavBar } from 'antd-mobile';
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import './index.scss'
import classNames from 'classnames'

class HmNavBar extends Component {
    static propTypes = {
        children: PropTypes.string.isRequired
    }
    render() {
        return (
            <div className={classNames('navbar', this.props.className)}>
                <NavBar
                    mode="light"
                    icon={<span className='iconfont icon-back'></span>}
                    onLeftClick={() => this.props.history.go(-1)}
                    rightContent={this.props.rightContent}
                >
                    {this.props.children}
                </NavBar>
            </div>
        )
    }
}
// 导出被withRouter包裹的组件
export default withRouter(HmNavBar)
