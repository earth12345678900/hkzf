import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { HashRouter as Router } from 'react-router-dom'
// 引入antd-mobile样式
import 'antd-mobile/dist/antd-mobile.css';
import 'react-virtualized/styles.css';
import './styles/base.scss'
import './styles/fonts/iconfont.css'

ReactDOM.render(<Router><App /></Router>, document.getElementById('root'));

