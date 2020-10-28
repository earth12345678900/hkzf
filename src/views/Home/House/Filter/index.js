import React from 'react'
import styles from './index.module.scss'
import FilterTitle from '../FilterTitle'
import FilterPicker from '../FilterPicker'
import FilterMore from '../FilterMore'
import { getCurrentCity } from 'utils/city'
import { requestCondition } from 'api/house'
import { Spring } from 'react-spring/renderprops'

class Filter extends React.Component {
    state = {
        // 标题选中的状态
        titleSelectStatus: {
            area: false,
            mode: false,
            price: false,
            more: false
        },
        // 控制遮罩层级Filter的显示与隐藏
        openType: '',
        // 条件
        conditions: {},
        // 选中的筛选条件
        selectedValues: {
            area: ['area', 'null'],
            mode: ['null'],
            price: ['null'],
            more: []
        }
    }
    async componentDidMount() {
        const city = await getCurrentCity()
        const res = await requestCondition(city.value)
        if (res.status === 200) {
            this.setState({
                conditions: res.body
            })
        }
    }

    // 处理标题高亮
    handleTitleSelectStatus(type, value) {
        value = value.toString()
        if (type === 'area' && value === 'area,null') {
            return false
        } else if (type === 'mode' && value === 'null') {
            return false
        } else if (type === 'price' && value === 'null') {
            return false
        } else if (type === 'more' && value === '') {
            return false
        } else {
            return true
        }
    }

    onChange = (type) => {
        // 显示遮罩层的时候把溢出数据隐藏 使列表不能滚动
        document.body.style.overflow = 'hidden'
        // console.log(type);
        const { titleSelectStatus, selectedValues } = this.state
        const newTitleSelectStatus = { ...titleSelectStatus }
        Object.keys(titleSelectStatus).forEach(item => {
            if (type === item) {
                newTitleSelectStatus[type] = true
            } else {
                newTitleSelectStatus[item] = this.handleTitleSelectStatus(item, selectedValues[item])
            }
        })
        // 修改对应的属性值 (原则 不要在元数据上进行修改)
        this.setState({
            titleSelectStatus: newTitleSelectStatus,
            openType: type
        })
    }

    // 点击遮罩层隐藏 Filter
    onCancel = () => {
        // 取出遮罩 列表能滚动
        document.body.style.overflow = ''
        // 判断selectedValues是否为默认值 如果是默认值 不高亮
        const { openType, selectedValues, titleSelectStatus } = this.state
        // 遮罩层点击太快页面出错
        if (openType === '') return
        const newTitleSelectStatus = { ...titleSelectStatus }
        // 调用处理高亮的函数
        const result = this.handleTitleSelectStatus(openType, selectedValues[openType])
        newTitleSelectStatus[openType] = result
        this.setState({
            openType: '',
            titleSelectStatus: newTitleSelectStatus
        })
    }

    // 点击确定将函数传给filterFooter
    // 判断value是否是传过来的值 如果不是就是默认值不高亮
    onConfirm = (value) => {
        // 去掉遮罩 列表能滚动
        document.body.style.overflow = ''
        const { selectedValues, openType, titleSelectStatus } = this.state
        let newSelectedValues = { ...selectedValues }
        const newTitleSelectStatus = { ...titleSelectStatus }
        newSelectedValues[openType] = value
        // value 点击确认选择的数据
        console.log(value);
        // 调用处理高亮的函数
        const result = this.handleTitleSelectStatus(openType, value)
        newTitleSelectStatus[openType] = result
        this.setState({
            // 隐藏遮罩层
            openType: '',
            selectedValues: newSelectedValues,
            titleSelectStatus: newTitleSelectStatus
        })

        // 调用onFilter方法
        this.props.onFilter(newSelectedValues)
    }

    // 控制遮罩层是否显示
    renderMask = () => {
        const { openType } = this.state
        const isShowMask = ['area', 'mode', 'price'].includes(openType)
        // 遮罩层动画
        return (
            <Spring to={{ opacity: isShowMask ? 1 : 0 }}>
                {(props) => {
                    // props是opacity对象
                    if (props.opacity === 0) {
                        return null
                    }
                    return <div style={props} className="mask" onClick={this.onCancel} />
                }}
            </Spring>
        )
    }

    // 控制<FilterPicker></FilterPicker>组件的渲染与否
    renderFilterPicker = () => {
        const { openType, conditions, selectedValues } = this.state
        if (!['area', 'mode', 'price'].includes(openType)) {
            return null
        }
        // cols 列
        let data, cols
        if (openType === 'mode') {
            data = conditions.rentType
            cols = 1
        } else if (openType === 'price') {
            data = conditions.price
            cols = 1
        } else if (openType === 'area') {
            data = [conditions.area, conditions.subway]
            cols = 3
        }

        // 用于数据回显
        let defaultValues = selectedValues[openType]
        // 渲染Picker组件时候提供对应的数据
        return (
            <FilterPicker
                data={data}
                cols={cols}
                defaultValues={defaultValues}
                onCancel={this.onCancel}
                onConfirm={this.onConfirm}
                key={openType}
            ></FilterPicker>
        )
    }

    renderFilterMore = () => {
        const { openType, conditions: { characteristic, floor, oriented, roomType }, selectedValues } = this.state
        const defaultValues = selectedValues.more
        // if (openType === 'more') {
        return (
            <FilterMore
                {...{ characteristic, floor, oriented, roomType }}
                onCancel={this.onCancel}
                onConfirm={this.onConfirm}
                defaultValues={defaultValues}
                openType={openType}
            // value={{ ...{ characteristic, floor, oriented, roomType } }}
            ></FilterMore>
        )
        // } else {
        //     return null
        // }
    }

    render() {
        const { titleSelectStatus } = this.state
        return (
            <div className={styles.filter}>
                {this.renderMask()}

                <div className="content">
                    {/* filter组件的内容 */}
                    <FilterTitle
                        titleSelectStatus={titleSelectStatus}
                        // {...{ titleSelectStatus }}
                        onChange={this.onChange}
                    ></FilterTitle>

                    {this.renderFilterPicker()}

                    {/* <FilterMore></FilterMore> */}
                    {this.renderFilterMore()}
                </div>
            </div>
        )
    }
}

export default Filter