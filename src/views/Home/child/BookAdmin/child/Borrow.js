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
                    dataIndex: 'id'
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
                    title: '借阅日期',
                    dataIndex: 'borrowDate'
                },
                {
                    title: '应归还日期',
                    dataIndex: 'expectReturnDate'
                },
                {
                    fixed: "right",
                    width: 180,
                    title: '操作',
                    render: (t, r) => (
                        <Space size="middle">
                            <Popconfirm
                                title="确定归还？"
                                onConfirm={this.bookReturn.bind(this, r)}
                                okText="确定"
                                cancelText="取消"
                            >
                                <Button type="primary">归还</Button>
                            </Popconfirm>
                            <Popconfirm
                                title="确定续借？"
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
            loading: false
        };
    }
    bookReturn(r) {
        this.Axios.post("/api/bookReturn", {
            token: this.props.userInfo.token,
            bid: r.bid
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
    continueBorrow(r) {
        this.Axios.post("/api/continueBorrow", {
            token: this.props.userInfo.token,
            bid: r.bid
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
                this.Axios.get("/api/showBorrow", {
                    params: {
                        token: this.props.userInfo.token
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
                           rowKey={record => record.bid}
                           scroll={{ x: 1000, y: this.props.height - 240 }}
                    />
                </Spin>
            </div>
        )
    }
}