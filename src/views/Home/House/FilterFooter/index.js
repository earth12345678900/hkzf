import React from 'react'
import { Flex } from 'antd-mobile'
import styles from './index.module.scss'
import classNames from 'classnames'
import PropTypes from 'prop-types'

class FilterFooter extends React.Component {
    static defaultProps = {
        cancelText: '取消',
        confirmText: '确定'
    }

    render() {
        // console.log(this.props)
        const { onCancel, onConfirm, cancelText, confirmText, style } = this.props
        return (
            // 不能把className给丢掉
            <Flex style={style} className={classNames(styles['filter-footer'], this.props.className)}>
                {/* 取消按钮 */}
                <span className="btn cancel" onClick={onCancel}>{cancelText}</span>
                {/* 确定按钮 */}
                <span className="btn ok" onClick={onConfirm}>{confirmText}</span>
            </Flex>
        )
    }
}

export default FilterFooter