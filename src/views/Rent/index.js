import React, { Component } from 'react'
import HmNavBar from 'components/HmNavBar'
import { requestRentList } from 'api/house'
import HmHouseItem from 'components/HmHouseItem'
import { Link } from 'react-router-dom'

export default class Favorite extends Component {
    state = {
        list: []
    }
    render() {
        return (
            <div style={{ paddingTop: 45 }}>
                <HmNavBar rightContent={<Link style={{ color: '#333' }} to='rent/add'>去出租</Link>}>我的出租</HmNavBar>
                {
                    this.state.list.map(item => (
                        // HmHouseItem解构出house 所以传house
                        <HmHouseItem key={item.houseCode} house={item}></HmHouseItem>
                    ))
                }
            </div>
        )
    }

    async componentDidMount() {
        const res = await requestRentList()
        if (res.status === 200) {
            this.setState({
                list: res.body
            })
        }
    }
}
