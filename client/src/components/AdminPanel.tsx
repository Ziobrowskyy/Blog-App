import React, {ChangeEvent, Component, createRef, FormEvent, RefObject} from "react"
import {API} from "../API"
import Form from "./Form"
import {FormFileInput, FormTextArea, FormTextInput} from "./FormField"
import FormButton from "./FormButton"
import FormHeader from "./FormHeader"
import Alert, {AlertType} from "./Alert"
import "../styles/AdminPanel.scss"

interface IState {
    title: string
    content: string
    files: any
    alert: {
        show: boolean
        content: string
        type?: AlertType
    }
}

export default class AdminPanel extends Component<any, IState> {
    private readonly titleInputRef: RefObject<HTMLInputElement>
    private readonly contentInputRef: RefObject<HTMLTextAreaElement>
    private readonly fileInputRef: RefObject<HTMLInputElement>

    constructor(props: any) {
        super(props)

        this.state = {
            title: "",
            content: "",
            files: [],
            alert: {
                show: false,
                content: ""
            }
        }

        this.titleInputRef = createRef<HTMLInputElement>()
        this.contentInputRef = createRef<HTMLTextAreaElement>()
        this.fileInputRef = createRef<HTMLInputElement>()
    }

    async handleSubmit(event: FormEvent) {
        event.preventDefault()

        this.setAlert(true, "Submitting post", "info")

        const formData = new FormData(event.target as HTMLFormElement)

        const form = event.target as HTMLFormElement
        form.reset()

        const response = await API.insertPost(formData)

        if (response.status) {
            this.setAlert(true, "Post submitted!", "success")
        } else {
            this.setAlert(true, "Cannot submit post", "warn")
        }

    }

    setAlert(show: boolean, content: string = "", type?: AlertType) {
        this.setState({
            alert: {show, content, type}
        })
    }

    render() {
        const {alert} = this.state

        return (
            <div className={"panel-wrapper"}>

                {alert.show && <Alert type={alert.type} onDismiss={() => this.setAlert(false)}>{alert.content}</Alert>}

                <Form onSubmit={this.handleSubmit.bind(this)}>
                    <FormHeader>upload post</FormHeader>

                    <FormTextInput name={"title"} text={"title"} ref={this.titleInputRef}
                                   onChange={(e: ChangeEvent<HTMLInputElement>) => this.setState({title: e.target.value})}
                    />

                    <FormTextArea name={"content"} text={"post content"} ref={this.contentInputRef}
                                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) => this.setState({content: e.target.value})}
                    />

                    <FormFileInput name={"files"} text={"upload photos"} ref={this.fileInputRef}
                                   onChange={(e: ChangeEvent<HTMLInputElement>) => this.setState({files: e.target.files})}
                    />

                    <FormButton variant={"primary"}>submit</FormButton>
                </Form>
            </div>
        )
    }
}