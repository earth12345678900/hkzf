import React from 'react'
import { Redirect, Route } from 'react-router-dom'
import { hasToken } from 'utils/token'

export default function PrivateRoute({ component: Component, ...rest }) {
    return (
        // react路由传参 this.props.history.push({pathname:'',state:{}})
        <Route {...rest}>
            {(props) => {
                return hasToken() ? (
                    <Component {...props}></Component>
                ) : (
                        // 没有token被拦截 登录后页面跳转到之前什么页面来的那个页面
                        <Redirect to={{ pathname: '/login', state: { from: props.location } }} ></Redirect>
                    )
            }}
        </Route >
    )
}
