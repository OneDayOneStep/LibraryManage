import { Component } from "react";
import { Input, Row, Col, Button, message } from "antd";
import {
    UserOutlined,
    KeyOutlined,
    MailOutlined,
    CheckCircleOutlined,
    DesktopOutlined,
    BookOutlined
} from '@ant-design/icons';

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLogin: true,
            id: "",
            user: "",
            password: "",
            mail: ""
        };
    }
    changeValue(which, e) {
        let updateValue = {};
        updateValue[which] = e.target.value || "";
        this.setState(updateValue);
    }
    changePageType() {
        this.setState({
            isLogin: !this.state.isLogin,
            id: "",
            user: "",
            password: "",
            mail: ""
        })
    }
    submit() {
        this.Axios.post("/api/" + (this.state.isLogin ? "login" : "addUser"),
            {
                uid: this.state.id,
                name: this.state.user,
                password: this.state.password,
                email: this.state.mail
            })
            .then((res) => {
                if (res.data.success) {
                    sessionStorage.setItem("userInfo", JSON.stringify(res.data.message));
                    if (this.state.isLogin) {
                        message.success("登陆成功");
                        this.props.history.push("/Home");
                    } else {
                        message.success("注册成功");
                        this.changePageType();
                    }
                } else {
                    message.error(res.data.message);
                }
            })
            .catch(() => {
                if (this.state.isLogin) {
                    message.error("登录失败 填写错误/用户不存在/密码错误");
                } else {
                    message.error("注册失败 填写错误/用户已存在/联系管理员");
                }
            });
    }
    render() {
        return (
            <div className="Login">
                <div className="LoginTitle">
                    <BookOutlined />
                    <span style={{
                        paddingLeft: "10px"
                    }}>Library System</span>
                </div>
                <div className="LoginBox RowSpace">
                    <Row>
                        <Col span={24} style={{
                            fontSize: "26px",
                            paddingLeft: "15px"
                        }}>
                            <DesktopOutlined />
                            <span style={{paddingLeft: "10px"}}/>
                            { this.state.isLogin ? "登录" : "注册" }
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <Input placeholder="用户名" prefix={<UserOutlined />} size="large" value={this.state.id}
                                   onChange={this.changeValue.bind(this, "id")}
                            />
                        </Col>
                    </Row>
                    {
                        this.state.isLogin
                        ? null
                        : <Row>
                            <Col span={24}>
                                <Input placeholder="昵　称" prefix={<UserOutlined />} size="large" value={this.state.user}
                                         onChange={this.changeValue.bind(this, "user")}/>
                            </Col>
                        </Row>
                    }
                    <Row>
                        <Col span={24}>
                            <Input placeholder="密　码" prefix={<KeyOutlined />} size="large" value={this.state.password}
                                   type="password"
                                   onChange={this.changeValue.bind(this, "password")}/>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>{
                            this.state.isLogin
                                ? null
                                : <Input placeholder="邮　箱" size="large" prefix={<MailOutlined />} value={this.state.mail}
                                         onChange={this.changeValue.bind(this, "mail")}
                                />
                        }</Col>
                    </Row>
                    <div style={{
                        color: "#888",
                        textAlign: "center",
                        margin: "20px 0"
                    }}>
                        <span
                            onClick={this.changePageType.bind(this)}
                            style={{
                            cursor: "pointer"
                        }}>
                            { this.state.isLogin ? "注册" : "登录" }
                        </span>
                    </div>
                    <Row>
                        <Col span={24} style={{
                            textAlign: "center"
                        }}>
                            <Button type="primary"
                                    shape="round"
                                    size="large"
                                    icon={<CheckCircleOutlined />}
                                    style={{width: "150px"}}
                                    onClick={this.submit.bind(this)}
                            >
                                { this.state.isLogin ? "登录" : "注册" }
                            </Button>
                        </Col>
                    </Row>
                </div>
            </div>
        )
    }
}