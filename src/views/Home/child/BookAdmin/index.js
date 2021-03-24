import { Component } from "react";
import BookManage from "./child/BookManage";
import Borrow from "./child/Borrow";
import UserManage from "./child/UserManage";

export default class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            index: this.props.index
        }
    }
    static getDerivedStateFromProps(nextProps, prevProps) {
        const { index } = nextProps;
        if(index !== prevProps.type){
            return {index}
        }
        return null;
    }
    render() {
        return (
            [
                <BookManage userInfo={this.props.userInfo} height={this.props.height} />,
                <Borrow userInfo={this.props.userInfo} height={this.props.height} />,
                <UserManage userInfo={this.props.userInfo} height={this.props.height} />
            ][this.state.index]
        )
    }
}