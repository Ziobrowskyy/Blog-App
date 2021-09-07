import React, {Component} from "react";
import {Api} from "../API";
import {Post, PostData} from "./Post";
import {Alert, Container} from "react-bootstrap";
import HttpRequest from "../decorators/HttpRequest";
import "../styles/PostsList.scss"

enum Status {
    loading,
    success,
    fail
}

interface IState {
    data: Array<PostData>;
    status: Status
}

export default class PostsList extends Component<any, IState> {
    state: IState = {
        data: [],
        status: Status.loading
    }

    public constructor(props: object) {
        super(props);
        this.removePost = this.removePost.bind(this);
    }

    componentDidMount = async () => {
        await Api.getAllPosts().then(result => {
            this.setState({
                data: JSON.parse(result.data.data),
                status: Status.success
            })
        }).catch(errorMessage => {
            this.setState({
                //data: JSON.stringify(errorMessage),
                status: Status.fail
            })
        })

    }

    @HttpRequest
    protected async removePost(id: string) {
        const response = await Api.deletePostById(id);

        if (response.data.success) {
            const data = this.state.data.filter(data => data._id !== id);
            this.setState({data});
        }
    }

    renderByStatus() {
        const {status, data} = this.state

        switch (status) {
            case Status.success:
                return data.map((data: PostData, i: number) => <Post key={i} data={data} onDelete={this.removePost}/>)
            case Status.fail:
                return <Alert>Data could not be loaded</Alert>
            default:
                return <Alert>Page is loading</Alert>
        }
    }

    render() {
        return (
            <Container className={"posts-wrapper"}>
                {this.renderByStatus()}
            </Container>
        );
    }
}