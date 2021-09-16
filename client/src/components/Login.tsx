import React, {ChangeEvent, Component, FormEvent} from "react"
import {API} from "../API"
import {FormTextInput} from "./FormField"
import FormButton from "./FormButton"
import FormHeader from "./FormHeader"
import Form from "./Form"
import "../styles/Login.scss"
import Alert from "./Alert"

interface IProps {
    onLogin: () => void
    onRegister: () => void
}

interface IState {
    username: string
    password: string
    showAlert: boolean
}

export default class Login extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props)
        this.state = {
            username: "",
            password: "",
            showAlert: false
        }
    }

    async handleSubmit(e: FormEvent) {
        console.log("SUBMIT")
        e.preventDefault()
        const {username, password} = this.state
        try {
            const response = await API.login({username, password})
            console.log(response)

            if (response.data.success)
                this.props.onLogin()
            else
                this.setState({showAlert: true})

        } catch (e) {
            this.setState({showAlert: true})
        }
    }

    onRegister(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault()
        this.props.onRegister()
    }

    render() {
        return (
            <div className={"auth-wrapper"}>

                {this.state.showAlert && <Alert type={"warn"}>Cannot log in!</Alert>}

                <Form onSubmit={this.handleSubmit.bind(this)}>
                    <FormHeader>user login</FormHeader>

                    <FormTextInput text={"username"}
                                   onChange={(e: ChangeEvent<HTMLInputElement>) => this.setState({username: e.target.value})}
                    />

                    <FormTextInput text={"password"} type={"password"}
                                   onChange={(e: ChangeEvent<HTMLInputElement>) => this.setState({password: e.target.value})}
                    />

                    <div className={"button-wrapper"}>
                        <FormButton variant={"primary"}>
                            log in
                        </FormButton>

                        <FormButton type={"button"} onClick={this.onRegister.bind(this)}>
                            register
                        </FormButton>
                    </div>
                </Form>
            </div>
        )
    }
}