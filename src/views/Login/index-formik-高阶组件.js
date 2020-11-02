import React, { Component } from 'react'
import { Flex, WingBlank, WhiteSpace, Toast } from 'antd-mobile'
import { Link } from 'react-router-dom'
import HmNavBar from 'components/HmNavBar'
import { withFormik, Form, Field, ErrorMessage } from 'formik'
import * as yup from 'yup'; // for everything
import styles from './index.module.scss'
import { reqLogin } from 'api/home'

// 验证规则：
// const REG_UNAME = /^[a-zA-Z_\d]{5,8}$/
// const REG_PWD = /^[a-zA-Z_\d]{5,12}$/

const Login = function (props) {
    return (
        <div className={styles.login}>
            {/* 顶部导航 */}
            <HmNavBar className='navHeader'>账号登录</HmNavBar>
            {/* 上下留白 */}
            <WhiteSpace size="xl" />

            {/* 登录表单 */}
            <WingBlank>
                <Form>
                    <div className="formItem">
                        <Field
                            className="input"
                            name="username"
                            placeholder="请输入账号"
                        />
                    </div>
                    {/* 长度为5到8位，只能出现数字、字母、下划线 */}
                    {/* {touched.username && errors.username && <div className="error">{errors.username}</div>} */}
                    {/* ErrorMessage本身也是render-props */}
                    <ErrorMessage name='username'>{(msg) => <div className="error">{msg}</div>}</ErrorMessage>
                    <div className="formItem">
                        <Field
                            className="input"

                            name="password"
                            type="password"
                            placeholder="请输入密码"
                        />
                    </div>
                    {/* 长度为5到12位，只能出现数字、字母、下划线 */}
                    {/* {touched.password && errors.password && <div className="error">{errors.password}</div>} */}
                    <ErrorMessage name='password'>{(msg) => <div className="error">{msg}</div>}</ErrorMessage>
                    <div className="formSubmit">
                        <button className="submit" type="submit">
                            登 录
                            </button>
                    </div>
                </Form>
                <Flex className="backHome">
                    <Flex.Item>
                        <Link to="/registe">还没有账号，去注册~</Link>
                    </Flex.Item>
                </Flex>
            </WingBlank>
        </div>
    )
}


const config = {
    mapPropsToValues: () => ({ username: '', password: '' }),

    handleSubmit: async (values, formikBag) => {
        // 登陆按钮
        // console.log(values);
        const res = await reqLogin(values.username, values.password)
        console.log(res);
        if (res.status === 200) {
            formikBag.props.history.goBack()
            Toast.success('登陆成功')
        } else {
            Toast.fail('登陆失败')
        }
    },

    validationSchema: yup.object().shape({
        username: yup.string().required('用户名不能为空').matches(/^[a-zA-Z_\d]{5,8}$/, '用户名为5-8位字母或数字'),
        password: yup.string().required('密码不能为空').matches(/^[a-zA-Z_\d]{5,12}$/, '用户名为5-12位字母或数字'),
    })
}
export default withFormik(config)(Login)
