import React, { Component } from 'react'

import { Link } from 'react-router-dom'
import { Grid, Button, Modal, Toast } from 'antd-mobile'

import { BASE_URL, hasToken, removeToken } from 'utils'

import styles from './index.module.scss'
import { reqUserInfo } from 'api/home'

// 菜单数据
const menus = [
  { id: 1, name: '我的收藏', iconfont: 'icon-coll', to: '/favorite' },
  { id: 2, name: '我的出租', iconfont: 'icon-ind', to: '/rent' },
  { id: 3, name: '看房记录', iconfont: 'icon-record' },
  {
    id: 4,
    name: '成为房主',
    iconfont: 'icon-identity'
  },
  { id: 5, name: '个人资料', iconfont: 'icon-myinfo' },
  { id: 6, name: '联系我们', iconfont: 'icon-cust' }
]

// 默认头像
const DEFAULT_AVATAR = BASE_URL + '/img/profile/avatar.png'

export default class My extends Component {
  state = {
    isLogin: false,
    user: {}
  }

  render() {
    const { history } = this.props
    const { isLogin, user } = this.state

    return (
      <div className={styles.my}>
        {/* 个人信息 */}
        <div className="title">
          <img
            className="bg"
            src={BASE_URL + '/img/profile/bg.png'}
            alt="背景图"
          />
          <div className="info">
            <div className="myIcon">
              <img className="avatar" src={isLogin ? BASE_URL + user.avatar : DEFAULT_AVATAR} alt="icon" />
            </div>
            <div className="user">
              <div className="name">{isLogin ? user.nickname : '游客'}</div>
              {/* 登录后展示： */}
              {/* 如果登陆展示结构A 没登录展示结构B */}
              {
                isLogin ? <>
                  <div className="auth">
                    <span onClick={this.logout}>退出</span>
                  </div>
                  <div className="edit">
                    编辑个人资料
                  <span className="arrow">
                      <i className="iconfont icon-arrow" />
                    </span>
                  </div>
                </> :
                  < div className="edit">
                    <Button
                      type="primary"
                      size="small"
                      inline
                      onClick={() => history.push('/login')}
                    >
                      去登录
                    </Button>
                  </div>
              }
              {/* <>
                <div className="auth">
                  <span onClick={this.logout}>退出</span>
                </div>
                <div className="edit">
                  编辑个人资料
                  <span className="arrow">
                    <i className="iconfont icon-arrow" />
                  </span>
                </div>
              </> */}

              {/* 未登录展示： */}
              {/* <div className="edit">
                <Button
                  type="primary"
                  size="small"
                  inline
                  onClick={() => history.push('/login')}
                >
                  去登录
                </Button>
              </div> */}
            </div>
          </div>
        </div>

        {/* 九宫格菜单 */}
        <Grid
          data={menus}
          columnNum={3}
          hasLine={false}
          renderItem={item =>
            item.to ? (
              <Link to={item.to}>
                <div className="menuItem">
                  <i className={`iconfont ${item.iconfont}`} />
                  <span>{item.name}</span>
                </div>
              </Link>
            ) : (
                <div className="menuItem">
                  <i className={`iconfont ${item.iconfont}`} />
                  <span>{item.name}</span>
                </div>
              )
          }
        />

        {/* 加入我们 */}
        <div className="ad">
          <img src={BASE_URL + '/img/profile/join.png'} alt="" />
        </div>
      </div >
    )
  }

  async componentDidMount() {
    // 判断是否有token
    if (hasToken()) {
      // 发送请求获取个人信息
      const res = await reqUserInfo()
      console.log(res);
      if (res.status === 200) {
        this.setState({
          isLogin: true,
          user: res.body
        })
      } else {
        this.setState({
          isLogin: false
        })
      }
    }
  }

  // 退出功能
  logout = () => {
    // 1.弹窗
    // 2.点击确定 删除token
    // 3.清除user和isLogin
    Modal.alert('温馨提示', '确定要退出吗', [
      {
        text: '确定', onPress: () => {
          // 删除token 
          removeToken()
          // 清除user和isLogin
          this.setState({
            isLogin: false,
            user: {}
          })
          Toast.success('成功退出')
        }
      },
      { text: '取消' }
    ])
  }
}
