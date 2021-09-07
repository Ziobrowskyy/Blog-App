import React, {ChangeEvent, Component, FormEvent} from "react";
import {Button, Form} from "react-bootstrap";
import {Api} from "../API";

interface IState {
    title: string;
    content: string;
    files: any
}

class AdminPanel extends Component<any, IState> {
    constructor(props: any) {
        super(props);

        this.state = {
            title: "",
            content: "",
            files: [],
        }
    }

    async handleSubmit(event: FormEvent) {
        event.preventDefault()
        const {title, content, files} = this.state
        const formData = new FormData(event.target as HTMLFormElement)
        const formData2 = new FormData()
        formData2.append("title", title)
        formData2.append("content", content)
        formData2.append("files", files)
        console.log(formData.get("files"))
        console.log(formData2.get("files"))
        const response = await Api.insertPost(formData)
        console.log("Server response:")
        console.log(response)
    }

    render() {
        return (
            <>
                <Form onSubmit={this.handleSubmit.bind(this)}>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Title</Form.Label>
                        <Form.Control name="title" type="text" placeholder="Enter title"
                                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                          this.setState({title: e.target.value})
                                      }}/>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Post content</Form.Label>
                        <Form.Control name="content" as={"textarea"}
                                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            this.setState({content: e.target.value})
                        }}/>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formFileMultiple">
                        <Form.Label>Upload photos</Form.Label>
                        <Form.File name="files" multiple accept="image/*"
                                   onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                       this.setState({files: e.target.files})
                                   }}/>
                    </Form.Group>

                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </Form>
            </>
        );
    }
}

export default AdminPanel;