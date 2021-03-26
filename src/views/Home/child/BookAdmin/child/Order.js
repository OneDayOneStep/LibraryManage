import React, { Component } from "react";
import {
    Table,
    Space,
    Button,
    Popconfirm,
    message,
    Spin
} from 'antd';

export default class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {
                    title: '读者',
                    dataIndex: 'name'
                },
                {
                    title: '书名',
                    dataIndex: 'bookname'
                },
                {
                    title: 'ISBN',
                    dataIndex: 'isbn'
                },
                {
                    fixed: "right",
                    width: 180,
                    title: '操作',
                    render: (t, r) => (
                        <Space size="middle">
                            <Popconfirm
                                title="确定借阅？"
                                onConfirm={this.order.bind(this, r)}
                                okText="确定"
                                cancelText="取消"
                            >
                                <Button type="primary">借阅</Button>
                            </Popconfirm>
                        </Space>
                    )
                },
            ],
            orderList: [],
            loading: false
        };
    }
    order(r) {
        this.Axios.post("/api/bookBorrow", {
            token: this.props.userInfo.token,
            uid: r.bid,
            isbn: r.isbn
        })
            .then(r => {
                if (r.data.success) {
                    message.success(r.data.message);
                } else {
                    message.error(r.data.message);
                }
                this.getOrder();
            })
            .catch(() => {
                message.error("操作失败");
            });
    }
    getOrder() {
        if (this.props.userInfo.token) {
            this.setState({
                loading: true
            });
            setTimeout(() => {
                this.Axios.get("/api/showOrder", {
                    params: {
                        token: this.props.userInfo.token
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