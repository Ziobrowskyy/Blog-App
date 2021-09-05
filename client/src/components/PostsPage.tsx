import React, {Component} from "react";
import api from "../API";
import {Post} from "./Post";
import {Alert, CardColumns} from "react-bootstrap";


enum Status {
    loading,
    success,
    fail
}

interface State {
    data: any;
    status: Status
}

export class PostsPage extends Component<any, State> {
    state: State = {
        data: undefined,
        status: Status.loading
    }
    componentDidMount = async () => {
        await api.getAllPosts().then(result => {
            this.setState({
                data: JSON.parse(result.data.data),
                status: Status.success
            })
        }).catch(errorMessage => {
            this.setState({
                data: JSON.stringify(errorMessage),
                status: Status.fail
            })
        })

    }

    render() {
        const {status, data} = this.state
        return (
            <>
                <p>status: {status}</p>
                <h1>List of all posts in the database</h1>
                {renderByStatus(status, data)}
            </>
        );
    }
}

function renderByStatus(status: Status, data: any) {
    switch (status) {
        case Status.success:
            const posts = data?.map((data: any, i: any) => <Post data={data} key={i}/>)
            return <CardColumns>{posts}</CardColumns>
        case Status.fail:
            return <Alert>Data could not be loaded</Alert>
        default:
            return <Alert>Page is loading</Alert>
    }
}

export default PostsPage;


