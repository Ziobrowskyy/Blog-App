import React, {Component, FormEvent} from "react";
import {Button, Form} from "react-bootstrap";
import {Api} from "../API";

interface IProps {
    onLogin: () => void
}

interface IState {
    username: string;
    password: string;
}

export default class Login extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            username: "",
            password: ""
        }
    }

    async handleSubmit(event: FormEvent) {
        event.preventDefault()
        const {username, password} = this.state
        try {
            const response = await Api.login({username, password})
            if (response.data.success) {
                this.props.onLogin()
            }
        } catch (error) {
            console.log(error);
        }
    }

    render() {
        return (
            <div>
                <Form onSubmit={this.handleSubmit.bind(this)}>
                    <Form.Group className="mb-3">
                        <Form.Label>Login</Form.Label>
                        <Form.Control name="login" type="text"
                                      onChange={event => this.setState({username: event.target.value})}/>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Password</Form.Label>
                        <Form.Control name="password" type={"password"}
                                      onChange={event => this.setState({password: event.target.value})}/>
                    </Form.Group>

                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </Form>
            </div>
        );
    }
}