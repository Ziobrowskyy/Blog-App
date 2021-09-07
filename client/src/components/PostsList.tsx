import React, {Component} from "react";
import {Apis} from "../API";
import {Post} from "./Post";
import {Alert, Container} from "react-bootstrap";
import "../styles/PostsList.scss"

enum Status {
    loading,
    success,
    fail
}

interface State {
    data: any;
    status: Status
}

export class PostsList extends Component<any, State> {
    state: State = {
        data: undefined,
        status: Status.loading
    }
    componentDidMount = async () => {
        await Apis.getAllPosts().then(result => {
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
            <Container className={"posts-wrapper"}>
                {renderByStatus(status, data)}
            </Container>
        );
    }
}

function renderByStatus(status: Status, data: any) {
    switch (status) {
        case Status.success:
            return data?.map((data: any, i: number) => <Post data={data} key={i}/>)
        case Status.fail:
            return <Alert>Data could not be loaded</Alert>
        default:
            return <Alert>Page is loading</Alert>
    }
}

export default PostsList;


