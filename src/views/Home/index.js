import React, { Component } from "react";

// antd
import { Layout, Dropdown, Menu, Modal, Button, message } from 'antd';
import {
    BookOutlined,
    UserOutlined,
    SettingOutlined,
    PoweroffOutlined,
    BarsOutlined
} from '@ant-design/icons';

import ck from "js-cookie";

// page
import Admin from "./child/Admin";
import User from "./child/User";
import BookAdmin from "./child/BookAdmin";

import Account from "./component/Account";

const { Header, Content, Footer } = Layout;

export default class Home extends Component {
    constructor(props) {
        super(props);
        let userInfo = JSON.parse(this.checkLogin() || "{}");
        this.state = {
            userInfo: userInfo,
            updateUrl: "",
            addUrl: "",
            menus: [
                ["图书管理", "借阅管理", "用户管理"], // 图书管理员
                ["图书管理员设置"], // 管理员
                ["图书搜索", "图书借阅"] // 用户
            ],
            menu: [],
            menuIndex: ck.get("menuIndex") || "0",
            whichUserPage: -1,
            windowHeight: window.innerHeight,
            maybeIsMobile: window.innerWidth < 900,
            navLeft: -220
        };
        this.account = React.createRef();
    }
    componentDidMount() {
        this.afterLogin();
        window.addEventListener('resize', this.checkScreen.bind(this));
    }
    checkScreen(e) {
        this.setState({
            windowHeight: e.target.innerHeight,
            maybeIsMobile: e.target.innerWidth < 900
        });
    }
    checkLogin() {
        return sessionStorage.getItem("userInfo") || this.props.history.replace("/Login");
    }
    afterLogin() {
        let level = this.state.userInfo.adminlevel;
        if (level === 0) {
            this.setState({
                updateUrl: "/api/updateAdmin",
                addUrl: "/api/addAdmin",
                menu: this.state.menus[0],
                whichUserPage: 0
            });
        } else if (level === 1) {
            this.setState({
                updateUrl: "/api/updateAdmin",
                addUrl: "/api/addAdmin",
                menu: this.state.menus[1],
                whichUserPage: 1
            });
        } else {
            this.setState({
                updateUrl: "/api/updateUser",
                addUrl: "/api/addUser",
                menu: this.state.menus[2],
                whichUserPage: 2
            });
        }
    }
    control(e) {
        if (e.key - 0 === 1) {
            this.account.current.openModal(1, {
                id: this.state.userInfo.id,
                user: this.state.userInfo.name,
                password: this.state.userInfo.password,
                mail: this.state.userInfo.email
            });
        } else {
            Modal.confirm({
                icon: <PoweroffOutlined />,
                content: "退出登录",
                okText: "确定",
                cancelText: "取消",
                onOk: () => {
                    this.setState({
                        userInfo: {}
                    });
                    sessionStorage.removeItem("userInfo");
                    this.props.history.replace("/Login");
                    message.success("已退出");
                }
            });
        }
    }
    toggleNavgation() {
        if (this.state.navLeft === 0) {
            this.setState({
                navLeft: -220
            })
        } else {
            this.setState({
                navLeft: 0
            })
        }
    }
    render() {
        return (
            <Layout className="layout">
                <Header>
                    <div style={{
                        float: "right",
                        height: "100%"
                    }}>
                        <Dropdown overlay={
                            <Menu onClick={this.control.bind(this)}>
                                <Menu.Item key="1" icon={<UserOutlined />}>
                                    修改信息
                                </Menu.Item>
                                <Menu.Item key="2" icon={<PoweroffOutlined />}>
                                    退出登录
                                </Menu.Item>
                            </Menu>
                        }>
                            <span className="userControl">
                                <span style={{
                                    display: this.state.maybeIsMobile ? "none" : "inline-block"
                                }}>
                                    { this.state.userInfo.name || "" }
                                </span>
                                <SettingOutlined style={{
                                    marginLeft: "10px"
                                }} />
                            </span>
                        </Dropdown>
                        <Account ref={this.account}
                                 title="个人信息"
                                 userInfo={this.state.userInfo}
                                 updateUrl={this.state.updateUrl}
                                 addUrl={this.state.addUrl}
                                 index={this.state.menuIndex}
                        />
                    </div>
                    <div className="systemName">
                        <BookOutlined />
                        <span style={{paddingLeft: "10px"}}>L M</span>
                    </div>
                    <div className="navgation">
                        <Menu theme="dark" mode="horizontal"
                              defaultSelectedKeys={[this.state.menuIndex]}
                              selectedKeys={[this.state.menuIndex]}
                              onSelect={e => {
                                ck.set("menuIndex", e.key);
                                this.setState({
                                    menuIndex: e.key
                                })}}
                              style={{
                                  display: this.state.maybeIsMobile ? "none" : "block"
                              }}
                        >
                            {
                                this.state.menu.map((e, i) => <Menu.Item key={i.toString()}>{e}</Menu.Item>)
                            }
                        </Menu>
                    </div>
                    <div className="fixedNavgation" style={{
                        pointerEvents: this.state.navLeft === 0 ? "auto" : "none"
                    }}>
                        <div className="fixedNavgationMask" onClick={() => {
                            this.setState({
                                navLeft: -220
                            })
                        }} style={{
                            opacity: this.state.navLeft === 0 ? 1 : 0
                        }} />
                        <div className="fixedNavgationMenu" style={{
                            left: this.state.navLeft
                        }}>
                            <div className="fixedNavgationName">
                                <BookOutlined />
                                <span style={{paddingLeft: "10px"}}>L M</span>
                            </div>
                            <Menu theme="dark"
                                  defaultSelectedKeys={[this.state.menuIndex]}
                                  selectedKeys={[this.state.menuIndex]}
                                  onSelect={e => {
                                      ck.set("menuIndex", e.key);
                                      this.setState({
                                          menuIndex: e.key
                                      })}}
                            >
                                {
                                    this.state.menu.map((e, i) => <Menu.Item key={i.toString()}>{e}</Menu.Item>)
                                }
                            </Menu>
                        </div>
                    </div>
                    <Button type="primary" shape="round" icon={<BarsOutlined />} size="large"
                    onClick={this.toggleNavgation.bind(this)}
                    style={{
                        display: this.state.maybeIsMobile ? "inline-block" : "none"
                    }} />
                </Header>
                <Content style={{padding: "20px"}}>{
                    [
                        <BookAdmin userInfo={this.state.userInfo} index={this.state.menuIndex} height={this.state.windowHeight} />,
                        <Admin userInfo={this.state.userInfo} index={this.state.menuIndex} height={this.state.windowHeight} />,
                        <User userInfo={this.state.userInfo} index={this.state.menuIndex} height={this.state.windowHeight} />
                    ][this.state.whichUserPage] || <div />
                }</Content>
                <Footer className="Footer">School Library 2021</Footer>
            </Layout>
        )
    }
}