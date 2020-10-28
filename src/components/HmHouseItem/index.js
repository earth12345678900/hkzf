import React, { Component } from 'react'
import classNames from 'classnames'
import { BASE_URL } from 'utils/config'
import styles from './index.module.scss'

export default class HmHouseItem extends Component {
    render() {
        const { house } = this.props
        return (
            <div className={styles.house} style={this.props.style}>
                <div className="imgWrap">
                    <img
                        className="img"
                        src={BASE_URL + house.houseImg}
                        alt=""
                    />
                </div>
                <div className="content">
                    <h3 className="title">
                        {house.title}
                    </h3>
                    <div className="desc">{house.desc}</div>
                    <div>
                        {
                            house.tags.map((tag, index) => <span className={classNames('tag', 'tag' + ((index % 3) + 1))} key={tag}>{tag}</span>)
                        }
                    </div>
                    <div className="price">
                        <span className="priceNum">{house.price}</span> 元/月
                    </div>
                </div>
            </div>
        )
    }
}
