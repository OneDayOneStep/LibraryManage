import React, { Component } from "react";
import {
    Table,
    Space,
    Button,
    Popconfirm,
    message,
    Spin
} from 'antd';

import {
    PlusCircleOutlined
} from '@ant-design/icons';

import Account from "../../../component/Account";

export default class index extends Component {
    constructor(props) {
        super(props);
        this.account = React.createRef();
        this.state = {
            columns: [
                {
                    title: '图书管理员',
                    dataIndex: 'name'
                },
                {
                    title: '账号',
                    dataIndex: 'id'
                },
                {
                    title: '邮箱',
                    dataIndex: 'email'
                },
                {
                    title: '操作',
                    fixed: "right",
                    width: 180,
                    render: (t, r) => (
                        <Space size="middle">
                            <Button type="primary" onClick={() => {
                                this.account.current.state.openModal(1, {
                                    id: r.id,
                                    user: r.name,
                                    mail: r.email
                                })
                            }}>修改</Button>
                            <Popconfirm
                                title="确定删除该用户？"
                                onConfirm={this.deleteUser.bind(this, r)}
                                okText="确定"
                                cancelText="取消"
                            >
                                <Button type="primary" danger>删除</Button>
                            </Popconfirm>
                        </Space>
                    )
                },
            ],
            userList: [],
            loading: false
        };
    }
    getAdmin() {
        if (this.props.userInfo.token) {
            this.setState({
                loading: true
            });
            setTimeout(() => {
                this.Axios.get("/api/showAdmin", {
                    params: {
                        token: this.props.userInfo.token
                    }
                })
                    .then((res) => {
                        let d = Array.isArray(res.data.message) ? res.data.message : [];
                        this.setState({
                            userList: d,
                            loading: false
                        })
                    })
                    .catch(() => {});
            }, 1000)
        }
    }
    componentDidMount() {
        this.getAdmin();
    }
    deleteUser(r) {
        this.Axios.post("/api/deleteAdmin", {
            token: this.props.userInfo.token,
            uid: r.id
        })
            .then(r => {
                if (r.data.success) {
                    message.success(r.data.message);
                } else {
                    message.error(r.data.message);
                }
                this.getAdmin();
            })
            .catch(() => {
                message.error("操作失败");
            });
    }
    render() {
        return (
            <div className="pages">
                <div style={{
                    paddingBottom: "10px",
                    textAlign: "right"
                }}>
                    <Button type="primary" icon={<PlusCircleOutlined />} size="large" onClick={() => {
                        this.account.current.state.openModal(0)
                    }}>
                        新增管理员
                    </Button>
                </div>
                <Spin spinning={this.state.loading}>
                    <Table columns={this.state.columns}
                           dataSource={this.state.userList}
                           rowKey={record => record.id}
                           scroll={{ x: 1000, y: this.props.height - 300 }}
                    />
                </Spin>
                <Account ref={this.account}
                         title="图书管理员"
                         userInfo={this.props.userInfo}
                         done={this.getAdmin.bind(this)}
                         updateUrl="/api/updateAdmin"
                         addUrl="/api/addAdmin"
                />
            </div>
        )
    }
}