import React, { Component } from 'react'
import HmNavBar from 'components/HmNavBar'
import { List, InputItem, Picker, TextareaItem, Flex, ImagePicker, Toast } from 'antd-mobile'
import HmHousePacility from 'components/HmHousePacility'
import styles from './index.module.scss'
import { upLoadHouseImage, addHouse } from 'api/house'
// 房屋类型
const roomTypeData = [
    { label: '一室', value: 'ROOM|d4a692e4-a177-37fd' },
    { label: '二室', value: 'ROOM|d1a00384-5801-d5cd' },
    { label: '三室', value: 'ROOM|20903ae0-c7bc-f2e2' },
    { label: '四室', value: 'ROOM|ce2a5daa-811d-2f49' },
    { label: '四室+', value: 'ROOM|2731c38c-5b19-ff7f' }
]

// 朝向：
const orientedData = [
    { label: '东', value: 'ORIEN|141b98bf-1ad0-11e3' },
    { label: '西', value: 'ORIEN|103fb3aa-e8b4-de0e' },
    { label: '南', value: 'ORIEN|61e99445-e95e-7f37' },
    { label: '北', value: 'ORIEN|caa6f80b-b764-c2df' },
    { label: '东南', value: 'ORIEN|dfb1b36b-e0d1-0977' },
    { label: '东北', value: 'ORIEN|67ac2205-7e0f-c057' },
    { label: '西南', value: 'ORIEN|2354e89e-3918-9cef' },
    { label: '西北', value: 'ORIEN|80795f1a-e32f-feb9' }
]

// 楼层
const floorData = [
    { label: '高楼层', value: 'FLOOR|1' },
    { label: '中楼层', value: 'FLOOR|2' },
    { label: '低楼层', value: 'FLOOR|3' }
]
export default class RentAdd extends Component {
    state = {
        price: '',
        size: '',
        roomType: [],
        floor: [],
        oriented: [],
        title: '',
        description: '',
        supporting: '',
        community: {},
        files: []
    }

    componentDidMount() {
        this.setState({
            community: this.props.location.community || {}
        })
    }

    render() {
        const { price, size, roomType, floor, oriented, title, description, community, files } = this.state
        return (
            <div className={styles.add} style={{ paddingTop: 45 }}>
                <HmNavBar>发布房源</HmNavBar>
                {/* 信息 */}
                <List renderHeader={() => '房源信息'}>
                    <List.Item
                        extra={community.communityName || '请输入小区名称'}
                        arrow="horizontal"
                        onClick={() => { this.props.history.push('/rent/search') }}>
                        小区名称
                    </List.Item>
                    <InputItem
                        placeholder="请输入租金/月"
                        onChange={this.onChange.bind(this, 'price')}
                        value={price}
                        extra="￥/月"
                    >
                        租　　金
                    </InputItem>
                    <InputItem
                        value={size}
                        onChange={this.onChange.bind(this, 'size')}
                        placeholder="请输入建筑面积"
                        extra="㎡"
                    >
                        建筑面积
                    </InputItem>
                    <Picker
                        extra="请选择"
                        cols="1"
                        data={roomTypeData}
                        onChange={this.onChange.bind(this, 'roomType')}
                        value={roomType}
                    >
                        <List.Item className="Item" arrow="horizontal">
                            户　　型
                        </List.Item>
                    </Picker>
                    <Picker extra="请选择" cols="1" data={floorData} value={floor} onChange={this.onChange.bind(this, 'floor')}>
                        <List.Item className="Item" arrow="horizontal">
                            所在楼层
                        </List.Item>
                    </Picker>
                    <Picker extra="请选择" cols="1" data={orientedData} value={oriented} onChange={this.onChange.bind(this, 'oriented')}>
                        <List.Item className="Item" arrow="horizontal">
                            朝　　向
                        </List.Item>
                    </Picker>
                </List>

                <List renderHeader={() => '房屋标题'}>
                    <InputItem placeholder="请输入标题" value={title} onChange={this.onChange.bind(this, 'title')}></InputItem>
                </List>

                <List
                    className="pics"
                    renderHeader={() => '房屋图像'}
                    data-role="rent-list"
                >
                    <ImagePicker
                        files={files}
                        onChange={this.onUpload}
                        selectable={files.length < 6}
                        multiple
                        length='3'
                    />
                </List>

                <List
                    className="supporting"
                    renderHeader={() => '房屋配置'}
                    data-role="rent-list"
                >
                    <HmHousePacility onSelect={this.onSelect}></HmHousePacility>
                </List>

                <List
                    className="desc"
                    renderHeader={() => '房屋描述'}
                    data-role="rent-list"
                >
                    <TextareaItem
                        style={{ fontSize: 14 }}
                        rows={5}
                        placeholder="请输入房屋描述信息"
                        autoHeight
                        value={description}
                        onChange={this.onChange.bind(this, 'description')}
                    />
                </List>

                <Flex className="bottom">
                    <Flex.Item className="cancel">取消</Flex.Item>
                    <Flex.Item className="confirm" onClick={this.add}>提交</Flex.Item>
                </Flex>
            </div>
        )
    }
    onChange = (type, value) => {
        // console.log(type, value)
        this.setState({
            [type]: value
        })
    }

    onSelect = (list) => {
        console.log(list);
        this.setState({
            // 后台要求用竖线拼接
            supporting: list.join('|')
        })
    }

    onUpload = (files) => {
        // console.log(files, type, index);
        this.setState({
            files: files.slice(0, 6)
        });
    }

    add = async () => {
        //上传图片
        const fd = new FormData()
        const { files } = this.state
        if (files.length < 3) {
            return Toast.info('请至少上传3张图片')
        }
        files.forEach(item => {
            fd.append('files', item.file)
        })
        const { body } = await upLoadHouseImage(fd)
        console.log(body);

        // 发送ajax请求，发布房源
        const res = await addHouse({
            ...this.state,
            houseImg: body.join('|'),
            oriented: this.state.oriented[0],
            roomType: this.state.roomType[0],
            floor: this.state.floor[0],
            community: this.state.community.community
        })
        console.log(res);
        if (res.status === 200) {
            this.props.history.push('/rent')
            Toast.success('发布房源成功')
        }
    }
}
