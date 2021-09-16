import React, {ChangeEvent, Component, FormEvent} from "react"
import {API} from "../API"
import {FormTextInput} from "./FormField"
import FormButton from "./FormButton"
import FormHeader from "./FormHeader"
import Form from "./Form"
import Alert from "./Alert"

interface IProps {
    onRegister: () => void
}

interface IState {
    username: string
    password: string
    showAlert: boolean
}

export default class Register extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props)
        this.state = {
            username: "",
            password: "",
            showAlert: false
        }
    }

    async handleSubmit(e: FormEvent) {
        e.preventDefault()
        const {username, password} = this.state

        try {
            const response = await API.register({username, password})

            if (response.data.success) {
                this.props.onRegister()
            } else {
                this.setState({showAlert: true})
            }
        } catch (e) {
            this.setState({showAlert: true})
        }
    }

    render() {
        return (
            <div className={"auth-wrapper"}>

                {this.state.showAlert && <Alert type={"warn"}>Cannot register</Alert>}

                <Form onSubmit={this.handleSubmit.bind(this)}>
                    <FormHeader>user register</FormHeader>

                    <FormTextInput text={"username"}
                                   onChange={(e: ChangeEvent<HTMLInputElement>) => this.setState({username: e.target.value})}
                    />

                    <FormTextInput text={"password"} type={"password"}
                                   onChange={(e: ChangeEvent<HTMLInputElement>) => this.setState({password: e.target.value})}
                    />

                    <FormButton variant={"primary"}>
                        register
                    </FormButton>
                </Form>
            </div>
        )
    }
}