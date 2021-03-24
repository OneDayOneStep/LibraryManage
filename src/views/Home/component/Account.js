import { Component } from "react";
import {
    Modal,
    Row,
    Col,
    Input,
    message
} from 'antd';

import {
    UserOutlined,
    KeyOutlined,
    MailOutlined,
} from '@ant-design/icons';
export default class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // modal
            isModalVisible: false,
            isEdit: true,
            id: "",
            user: "",
            password: "",
            mail: "",
            openModal: this.openModal
        }
    }

    changeValue(which, e) {
        let updateValue = {};
        updateValue[which] = e.target.value || "";
        this.setState(updateValue);
    }
    editUser() {
        this.Axios.post(this.state.isEdit ? this.props.updateUrl : this.props.addUrl, {
            token: this.props.userInfo.token,
            uid: this.state.id,
            name: this.state.user,
            password: this.state.password,
            email: this.state.mail
        })
            .then(() => {
                message.success("操作成功");
                this.setState({
                    isModalVisible: false
                });
                if (this.props.done instanceof Function) {
                    this.props.done();
                }
            })
            .catch(err => {
                console.log(err);
                message.error("操作失败");
            });
    }
    openModal = (type, r) => {
        if (type === 1) {
            // 修改
            let _r = {};
            if (r.type !== "click") {
                _r = r;
            }
            this.setState(Object.assign({
                isModalVisible: true,
                isEdit: true,
                id: "",
                user: "",
                password: "",
                mail: ""
            }, _r))
        } else if (type === 0) {
            // 新增
            this.setState({
                isModalVisible: true,
                isEdit: false,
                id: "",
                user: "",
                password: "",
                mail: ""
            })
        }
    };
    render() {
        return (
            <Modal title={this.props.title || "编辑账户"}
                   visible={this.state.isModalVisible}
                   onOk={this.editUser.bind(this)}
                   onCancel={() => {
                       this.setState({
                           isModalVisible: false
                       })
                   }}
                   okText={this.state.isEdit ? "修改" : "增加"}
                   cancelText="取消"
            >
                <div className="RowSpace">
                    <Row>
                        <Col span={24}>
                            <Input placeholder="用户名" prefix={<UserOutlined />} size="large" value={this.state.id}
                                   onChange={this.changeValue.bind(this, "id")} disabled={this.state.isEdit}
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
        )
    }
}