import { Component } from "react";
import {
    Table,
    Space,
    Button,
    Popconfirm,
    Modal,
    Row,
    Col,
    Input,
    message
} from 'antd';

import {
    UserOutlined,
    KeyOutlined,
    MailOutlined
} from '@ant-design/icons';

export default class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {
                    title: '图书管理员',
                    dataIndex: 'aname'
                },
                {
                    title: '账号',
                    dataIndex: 'aid'
                },
                {
                    title: '邮箱',
                    dataIndex: 'email'
                },
                {
                    title: '操作',
                    render: (t, r) => (
                        <Space size="middle">
                            <Button type="primary" onClick={this.modal.bind(this, true)}>修改</Button>
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
            isModalVisible: false,
            // modal
            isEdit: true,
            id: "",
            user: "",
            password: "",
            mail: ""
        };
    }
    getAdmin() {
        if (this.props.userInfo.token) {
            this.Axios.get("/api/showAdmin", {
                params: {
                    token: this.props.userInfo.token
                }
            })
                .then((res) => {
                    let d = Array.isArray(res.data.message) ? res.data.message : [];
                    this.setState({
                        userList: d
                    })
                })
                .catch(() => {});
        }
    }
    componentDidMount() {
        this.getAdmin();
    }
    editUser() {
        this.Axios.post("/api/addAdmin", {
            token: this.props.userInfo.token,
            uid: this.state.id,
            name: this.state.user,
            password: this.state.password,
            email: this.state.mail
        })
            .then((res) => {
                console.log(res);
            })
            .catch(() => {});
    }
    deleteUser(r) {
        this.Axios.post("/api/deleteAdmin", {
            token: this.props.userInfo.token,
            uid: r.aid
        })
            .then(() => {
                message.success("删除成功");
                this.getAdmin();
            })
            .catch(() => {});
    }
    modal(s) {
        this.setState({
            isModalVisible: s
        })
    }
    changeValue(which, e) {
        let updateValue = {};
        updateValue[which] = e.target.value || "";
        this.setState(updateValue);
    }
    render() {
        return (
            <div>
                <Table columns={this.state.columns} dataSource={this.state.userList} rowKey={record => record.aid} />
                <Modal title="图书管理员"
                       visible={this.state.isModalVisible}
                       onOk={this.editUser.bind(this)}
                       onCancel={this.modal.bind(this, false)}
                       okText={this.state.isEdit ? "修改" : "增加"}
                       cancelText="取消"
                >
                    <div className="RowSpace">
                        <Row>
                            <Col span={24}>
                                <Input placeholder="用户名" prefix={<UserOutlined />} size="large" value={this.state.id}
                                       onChange={this.changeValue.bind(this, "id")}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                <Input placeholder="昵　称" prefix={<UserOutlined />} size="large" value={this.state.user}
                                       onChange={this.changeValue.bind(this, "user")}/>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                <Input placeholder="密　码" prefix={<KeyOutlined />} size="large" value={this.state.password}
                                       type="password"
                                       onChange={this.changeValue.bind(this, "password")}/>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                <Input placeholder="邮　箱" size="large" prefix={<MailOutlined />} value={this.state.mail}
                                       onChange={this.changeValue.bind(this, "mail")}
                                />
                            </Col>
                        </Row>
                    </div>
                </Modal>
            </div>
        )
    }
}