import React, {ChangeEvent, Component, createRef, FormEvent, RefObject} from "react"
import {Api} from "../API"
import Form from "./Form"
import {FormFileInput, FormTextArea, FormTextInput} from "./FormField"
import FormButton from "./FormButton"
import FormHeader from "./FormHeader"
import "../styles/AdminPanel.scss"

interface IState {
    title: string
    content: string
    files: any
}

class AdminPanel extends Component<any, IState> {
    private readonly titleInputRef: RefObject<HTMLInputElement>
    private readonly contentInputRef: RefObject<HTMLTextAreaElement>
    private readonly fileInputRef: RefObject<HTMLInputElement>

    constructor(props: any) {
        super(props)

        this.state = {
            title: "",
            content: "",
            files: [],
        }

        this.titleInputRef = createRef<HTMLInputElement>()
        this.contentInputRef = createRef<HTMLTextAreaElement>()
        this.fileInputRef = createRef<HTMLInputElement>()
        this.handleSubmit.bind(this)
    }

    async handleSubmit(event: FormEvent) {
        event.preventDefault()
        // const {title, content, files} = this.state
        const formData = new FormData(event.target as HTMLFormElement)
        const response = await Api.insertPost(formData)
        console.log(response)

        if(response.status) {
            if(this.titleInputRef.current) {
                this.titleInputRef.current.value = ""
            }
            if(this.contentInputRef.current) {
                this.contentInputRef.current.value = ""
            }
            if(this.fileInputRef.current) {
                this.fileInputRef.current.files = null
            }
        }

    }

    render() {
        return (
            <div className={"panel-wrapper"}>
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

export default AdminPanel