import React, { Component } from "react";
import {
    Table,
    Space,
    Button,
    Popconfirm,
    message,
    Spin,
    Tooltip
} from 'antd';

export default class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {
                    title: '书名',
                    dataIndex: 'bookname',
                    ellipsis: {
                        showTitle: false
                    },
                    render: bookname => (
                        <Tooltip placement="topLeft" title={bookname}>
                            {bookname}
                        </Tooltip>
                    )
                },
                {
                    title: 'ISBN',
                    dataIndex: 'isbn'
                },
                {
                    title: '借阅时间',
                    dataIndex: 'borrowDate'
                },
                {
                    title: '应还时间',
                    dataIndex: 'expectReturnDate'
                },
                {
                    fixed: "right",
                    width: 100,
                    title: '操作',
                    render: (t, r) => (
                        <Space size="middle">
                            <Popconfirm
                                title="确定预约？"
                                onConfirm={this.continueBorrow.bind(this, r)}
                                okText="确定"
                                cancelText="取消"
                            >
                                <Button type="primary">续借</Button>
                            </Popconfirm>
                        </Space>
                    )
                },
            ],
            borrowList: [],
            loading: false,
            prevSearch: ""
        };
    }
    continueBorrow(r) {
        this.Axios.post("/api/continueBorrow", {
            token: this.props.userInfo.token,
            bid: r.bid,
        })
            .then(r => {
                if (r.data.success) {
                    message.success(r.data.message);
                } else {
                    message.error(r.data.message);
                }
                this.getBorrow();
            })
            .catch(() => {
                message.error("操作失败");
            });
    }
    getBorrow() {
        if (this.props.userInfo.token) {
            this.setState({
                loading: true
            });
            setTimeout(() => {
                this.Axios.get("/api/searchBorrow", {
                    params: {
                        token: this.props.userInfo.token,
                        uid: this.props.userInfo.id
                    }
                })
                    .then((res) => {
                        let d = Array.isArray(res.data.message) ? res.data.message : [];
                        this.setState({
                            borrowList: d,
                            loading: false
                        })
                    })
                    .catch(() => {});
            }, 1000)
        }
    }
    componentDidMount() {
        this.getBorrow();
    }
    render() {
        return (
            <div className="pages">
                <Spin spinning={this.state.loading}>
                    <Table columns={this.state.columns}
                           dataSource={this.state.borrowList}
                           rowKey={record => Math.random()}
                           scroll={{ x: 1000, y: this.props.height - 240 }}
                    />
                </Spin>
            </div>
        )
    }
}