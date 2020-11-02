import React, { Component } from 'react'
import { Flex, WingBlank, WhiteSpace } from 'antd-mobile'

import { Link } from 'react-router-dom'

import HmNavBar from 'components/HmNavBar'

import styles from './index.module.scss'

// 验证规则：
// const REG_UNAME = /^[a-zA-Z_\d]{5,8}$/
// const REG_PWD = /^[a-zA-Z_\d]{5,12}$/

class Login extends Component {
    render() {
        return (
            <div className={styles.login}>
                {/* 顶部导航 */}
                <HmNavBar className='navHeader'>账号登录</HmNavBar>
                {/* 上下留白 */}
                <WhiteSpace size="xl" />

                {/* 登录表单 */}
                <WingBlank>
                    <form>
                        <div className="formItem">
                            <input
                                className="input"
                                name="username"
                                placeholder="请输入账号"
                            />
                        </div>
                        {/* 长度为5到8位，只能出现数字、字母、下划线 */}
                        {/* <div className="error">账号为必填项</div> */}
                        <div className="formItem">
                            <input
                                className="input"
                                name="password"
                                type="password"
                                placeholder="请输入密码"
                            />
                        </div>
                        {/* 长度为5到12位，只能出现数字、字母、下划线 */}
                        {/* <div className="error">账号为必填项</div> */}
                        <div className="formSubmit">
                            <button className="submit" type="submit">
                                登 录
              </button>
                        </div>
                    </form>
                    <Flex className="backHome">
                        <Flex.Item>
                            <Link to="/registe">还没有账号，去注册~</Link>
                        </Flex.Item>
                    </Flex>
                </WingBlank>
            </div>
        )
    }
}

export default Login
