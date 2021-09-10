import React, {Component, FormEvent} from "react";
import {Api} from "../API";
import FormField from "./FormField";
import FormButton from "./FormButton";
import FormHeader from "./FormHeader";
import Form from "./Form";
import "../styles/Login.scss"

interface IProps {
    onLogin: () => void
}

enum ActionType {
    LOGIN,
    REGISTER
}

interface IState {
    action: ActionType
    username: string
    password: string
}

export default class Login extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            action: ActionType.LOGIN,
            username: "",
            password: ""
        }
    }

    async handleSubmit(e: FormEvent) {
        e.preventDefault()
        const {username, password, action} = this.state

        let response
        if (action == ActionType.LOGIN) {
            console.log("Login")
            response = await Api.login({login: username, password})
        } else {
            console.log("Register")
            response = await Api.login({login: username, password})
        }

        console.log(response)
        if (response.data.success) {
            this.props.onLogin()
        }
    }

    render() {
        return (
            <div className={"auth-wrapper"}>
                <Form onSubmit={this.handleSubmit.bind(this)}>
                    <FormHeader>user login</FormHeader>

                    <FormField text={"username"} onChange={event => this.setState({username: event.target.value})}/>

                    <FormField text={"password"} type={"password"} onChange={event => this.setState({password: event.target.value})}/>

                    <div className={"button-wrapper"}>
                        <FormButton variant={"primary"} onClick={__ => this.setState({action: ActionType.LOGIN})}>
                            log in
                        </FormButton>

                        <FormButton onClick={__ => this.setState({action: ActionType.REGISTER})}>
                            register
                        </FormButton>
                    </div>
                </Form>
            </div>
        );
    }
}