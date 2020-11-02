import React, { Component } from 'react'
import HmNavBar from 'components/HmNavBar'
import { requestFavoriteList } from 'api/house'
import HmHouseItem from 'components/HmHouseItem'

export default class Favorite extends Component {
    state = {
        favoriteList: []
    }
    render() {
        return (
            <div style={{ paddingTop: 45 }}>
                <HmNavBar>我的收藏</HmNavBar>
                {
                    this.state.favoriteList.map(item => (
                        // HmHouseItem解构出house 所以传house
                        <HmHouseItem key={item.houseCode} house={item}></HmHouseItem>
                    ))
                }
            </div>
        )
    }

    async componentDidMount() {
        const res = await requestFavoriteList()
        if (res.status === 200) {
            this.setState({
                favoriteList: res.body
            })
        }
    }
}
