import React, { Component } from "react";
import {
    Table,
    Space,
    Button,
    Popconfirm,
    message,
    Spin,
    Image,
    Tooltip,
    Alert,
    Input
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
                    title: '书籍图片',
                    render: (t, r) => (
                        <Image
                            width={100}
                            alt="书籍图片"
                            src={this.server + r.image}
                        />
                    )
                },
                {
                    title: '在馆数量',
                    dataIndex: 'booknum'
                },
                {
                    title: '在馆位置',
                    dataIndex: 'place'
                },
                {
                    fixed: "right",
                    width: 100,
                    title: '操作',
                    render: (t, r) => (
                        <Space size="middle">
                            <Popconfirm
                                title="确定预约？"
                                onConfirm={this.order.bind(this, r)}
                                okText="确定"
                                cancelText="取消"
                            >
                                <Button type="primary">预约</Button>
                            </Popconfirm>
                        </Space>
                    )
                },
            ],
            bookList: [],
            loading: false,
            prevSearch: ""
        };
    }
    order(r) {
        this.Axios.post("/api/bookOrder", {
            token: this.props.userInfo.token,
            uid: this.props.userInfo.id,
            isbn: r.isbn
        })
            .then(r => {
                if (r.data.success) {
                    message.success(r.data.message);
                } else {
                    message.error(r.data.message);
                }
                this.getBooks();
            })
            .catch(() => {
                message.error("操作失败");
            });
    }
    getBooks(v) {
        if (typeof v === "string") {
            this.setState({
                prevSearch: v
            });
        }
        if (this.props.userInfo.token) {
            this.setState({
                loading: true
            });
            setTimeout(() => {
                this.Axios.get("/api/searchBook", {
                    params: {
                        token: this.props.userInfo.token,
                        bookname: this.state.prevSearch
                    }
                })
                    .then((res) => {
                        let d = Array.isArray(res.data.message) ? res.data.message : [];
                        this.setState({
                            bookList: d,
                            loading: false
                        })
                    })
                    .catch(() => {});
            }, 1000)
        }
    }
    componentDidMount() {
        this.getBooks();
    }
    render() {
        return (
            <div className="pages">
                <Input.Search
                    placeholder="书名"
                    allowClear
                    enterButton="搜索"
                    size="large"
                    onSearch={v => {this.getBooks(v)}}
                />
                <Alert message="网上预约后请于3天内到图书馆中进行借阅！" type="info" showIcon style={{
                    margin: "15px 0"
                }} />
                <Spin spinning={this.state.loading}>
                    <Table columns={this.state.columns}
                           dataSource={this.state.bookList}
                           rowKey={record => Math.random()}
                           scroll={{ x: 1000, y: this.props.height - 360 }}
                    />
                </Spin>
            </div>
        )
    }
}