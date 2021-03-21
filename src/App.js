import './style/index.css';
import { Component } from "react";

// Router
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'

// Primary Page
import Login from "./views/Login";
import Home from "./views/Home";

export default class App extends Component {
    render() {
        return (
            <BrowserRouter>
                <Switch>
                    <Route path="/Home" exact component={Home}/>
                    <Route path="/Login" exact component={Login}/>
                    <Redirect path="/*" exact to="/Home"/>
                </Switch>
            </BrowserRouter>
        )
    }
}
