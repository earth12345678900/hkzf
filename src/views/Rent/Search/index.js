import React, { Component } from 'react'
import styles from './index.module.scss'
import { SearchBar } from 'antd-mobile';
import { reqCommunityList } from 'api/house'
import { getCurrentCity } from 'utils/city'

export default class RentSearch extends Component {
    state = {
        list: []
    }

    async componentDidMount() {
        const city = await getCurrentCity()
        this.id = city.value
    }
    render() {
        return (
            <div className={styles['rent-search']}>
                <SearchBar
                    placeholder="请输入小区名称"
                    showCancelButton
                    onCancel={() => { this.props.history.go(-1) }}
                    onChange={this.onChange}
                />

                <div className="list">
                    <ul className='tips'>
                        {this.state.list.map(item => (
                            <li className='tip'
                                key={item.community}
                                onClick={this.onClick.bind(this, item)}
                            >
                                {item.communityName}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        )
    }

    onChange = (value) => {
        // 防抖
        // console.log(value);
        clearTimeout(this.timer)
        this.timer = setTimeout(async () => {
            const res = await reqCommunityList(this.id, value)
            console.log(res);
            if (res.status === 200) {
                this.setState({
                    list: res.body
                })
            }
        }, 1000);
    }

    // // 效果同下 state可以不加
    // onClick = (community) => {
    //     console.log(community);
    //     this.props.history.push({
    //         pathname: 'rent/add',
    //         state: {
    //             community
    //         }
    //     })
    // }
    onClick = (community) => {
        console.log(community);
        this.props.history.push({
            pathname: '/rent/add',
            community
        })
    }
}
