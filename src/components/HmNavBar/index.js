import React, { Component } from 'react'
import { NavBar } from 'antd-mobile';
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import './index.scss'

class HmNavBar extends Component {
    static propTypes = {
        children: PropTypes.string.isRequired
    }
    render() {
        return (
            <div className='navbar'>
                <NavBar
                    mode="light"
                    icon={<span className='iconfont icon-back'></span>}
                    onLeftClick={() => this.props.history.go(-1)}
                >
                    {this.props.children}
                </NavBar>
            </div>
        )
    }
}
// 导出被withRouter包裹的组件
export default withRouter(HmNavBar)
