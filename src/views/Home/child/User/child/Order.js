import React, { Component } from "react";
import {
    Table,
    Spin
} from 'antd';

export default class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {
                    title: '书名',
                    dataIndex: 'bookname'
                },
                {
                    title: 'ISBN',
                    dataIndex: 'isbn'
                }
            ],
            orderList: [],
            loading: false
        };
    }
    getOrder() {
        if (this.props.userInfo.token) {
            this.setState({
                loading: true
            });
            setTimeout(() => {
                this.Axios.get("/api/searchOrder", {
                    params: {
                        token: this.props.userInfo.token,
                        uid: this.props.userInfo.id
                    }
                })
                    .then((res) => {
                        let d = Array.isArray(res.data.message) ? res.data.message : [];
                        this.setState({
                            orderList: d,
                            loading: false
                        })
                    })
                    .catch(() => {});
            }, 1000)
        }
    }
    componentDidMount() {
        this.getOrder();
    }
    render() {
        return (
            <div className="pages">
                <Spin spinning={this.state.loading}>
                    <Table columns={this.state.columns}
                           dataSource={this.state.orderList}
                           rowKey={record => record.bid}
                           scroll={{ x: 1000, y: this.props.height - 240 }}
                    />
                </Spin>
            </div>
        )
    }
}