import React, {Component, FormEvent} from "react";
import {Button, Form} from "react-bootstrap";
import {Api} from "../API";

interface IProps {
    onLogin: () => void
}

interface IState {
    login: string;
    password: string;
}

export default class Login extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            login: "",
            password: ""
        }
    }

    async handleSubmit(event: FormEvent) {
        event.preventDefault()
        const {login, password} = this.state
        const response = await Api.login({login, password})
        console.log(response)
        if (response.data.success) {
            console.log("LOGIN")
            this.props.onLogin()
        }
    }

    render() {
        return (
            <div>
                <Form onSubmit={this.handleSubmit.bind(this)}>
                    <Form.Group className="mb-3">
                        <Form.Label>Login</Form.Label>
                        <Form.Control name="login" type="text"
                                      onChange={event => this.setState({login: event.target.value})}/>
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