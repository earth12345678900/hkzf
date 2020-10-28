import React from 'react'
import { PickerView } from 'antd-mobile'
import FilterFooter from '../FilterFooter'
import styles from './index.module.scss'

class FilterPicker extends React.Component {
    state = {
        value: this.props.defaultValues
    }

    onChange = (value) => {
        console.log(value);
        this.setState({
            value
        })
    }
    render() {
        const { onCancel, data, cols, onConfirm } = this.props
        const { value } = this.state
        return (
            <div className={styles['filter-picker']}>
                {/* 三级联动 */}
                {/* 理解成受控组件 提供value 和 onChange */}
                <PickerView data={data} cols={cols} value={value} onChange={this.onChange} />
                {/* 底部 */}
                <FilterFooter onCancel={onCancel} onConfirm={onConfirm.bind(this, value)}></FilterFooter>
            </div>
        )
    }
}

export default FilterPicker