import React, {Component} from "react";
import api from "../api";


export class PostsList extends Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            isLoading: true,
            data: undefined,
            status: "constructor"
        }
    }

    componentDidMount = async () => {
        console.log("api check connection")
        this.setState({
            status: "didMount"
        })
        await api.checkConnection().then(result => {
            this.setState({
                data: result.data.data,
                status: "api data came back"
            })
            console.log(result)
        }).catch(reason => {
            this.setState({
                status: JSON.stringify(reason),
            })
        })
        this.setState({
            isLoading: false
        })
    }

    render() {
        const {isLoading, data, status} = this.state
        return (
            <>
                <p>isLoading: {isLoading.toString()}</p>
                <p>status: {status}</p>
                <h1>List of all posts in the database</h1>
                {isLoading ?
                    <h1>Page is loading, please wait</h1> :
                    <h1>Content:<br/>{data}</h1>
                }
            </>
        );
    }
}

