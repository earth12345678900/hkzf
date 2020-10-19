import React, { Component } from 'react'
import { NavLink, Route, Switch } from 'react-router-dom'
import House from './House/index'
import Index from './Index/index'
import My from './My/index'
import News from './News/index'
import './index.scss'

export default class Home extends Component {
    render() {
        return (
            <div className='home'>
                <div className='content'>
                    <Switch>
                        {/* 为了一上来显示Index组件 */}
                        <Route exact path='/home' component={Index}></Route>
                        <Route path='/home/house' component={House}></Route>
                        <Route path='/home/my' component={My}></Route>
                        <Route path='/home/news' component={News}></Route>
                    </Switch>
                </div>
                <div className='footer'>
                    <ul>
                        <li>
                            <NavLink exact to='/home'><span className='iconfont icon-ind'><p>首页</p></span></NavLink>
                        </li>
                        <li>
                            <NavLink to='/home/house'><span className='iconfont icon-findHouse'><p>找房</p></span></NavLink>
                        </li>
                        <li>
                            <NavLink to='/home/news'><span className='iconfont icon-infom'><p>资讯</p></span></NavLink>
                        </li>
                        <li>
                            <NavLink to='/home/my'><span className='iconfont icon-my'><p>我的</p></span></NavLink>
                        </li>
                    </ul>
                </div>
            </div>
        )
    }
}
