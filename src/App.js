import './App.css';
import { Component } from "react";

// router
// import { BrowserRouter, Route } from 'react-router-dom'

// pages
// import user from "./views/user/main";
// import picAdmin from "./views/picAdmin/main";
// import admin from "./views/admin/main";

// antd
import { Layout } from 'antd';
const { Header, Content, Footer } = Layout;


export default class App extends Component {
    render() {
        return (
            <Layout className="layout">
                <Header>Header</Header>
                <Content>Content</Content>
                <Footer>Footer</Footer>
            </Layout>
        )
    }
}

// function App() {
//   return (
//     <div className="App">
//         <BrowserRouter>
//             <Route path="/user" component={user} />
//             <Route path="/picAdmin" component={picAdmin} />
//             <Route path="/admin" component={admin} />
//         </BrowserRouter>
//     </div>
//   );
// }

