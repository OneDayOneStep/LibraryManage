import { Component } from "react";
import Books from "./child/Books";
import Borrow from "./child/Borrow";

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
                <Books userInfo={this.props.userInfo} height={this.props.height} />,
                <Borrow userInfo={this.props.userInfo} height={this.props.height} />,
            ][this.state.index]
        )
    }
}