import { Component } from "react";

// antd
import { Layout } from 'antd';
import {
    BookOutlined
} from '@ant-design/icons';

// page
import Admin from "./child/admin";
// import PicAdmin from "./child/picAdmin";
// import User from "./child/user";

const { Header, Content, Footer } = Layout;

export default class Home extends Component {
    constructor(props) {
        super(props);
        let userInfo = this.checkLogin();
        this.state = {
            userInfo: JSON.parse(userInfo)
        };
    }
    checkLogin() {
        return sessionStorage.getItem("userInfo") || this.props.history.replace("/Login");
    }
    render() {
        return (
            <Layout className="layout">
                <Header>
                    <div className="systemName">
                        <BookOutlined />
                        <span style={{paddingLeft: "10px"}}>Library Manage</span>
                    </div>
                </Header>
                <Content style={{
                    padding: "20px"
                }}>
                    <Admin userInfo={this.state.userInfo} />
                </Content>
                <Footer className="Footer">School Library 2021</Footer>
            </Layout>
        )
    }
}