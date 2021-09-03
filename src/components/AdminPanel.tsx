import React, {ChangeEvent, Component, FormEvent} from "react";
import {Button, Form} from "react-bootstrap";
import Apis from "../API";

class AdminPanel extends Component<any, any> {
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
        // formData.append("title", title)
        // formData.append("content", content)
        // formData.append("files", files)
        console.log(formData.get("title"))
        console.log(formData.get("content"))
        console.log(formData.get("files"))
        const response = await Apis.insertPost(formData)
        console.log(response)
    }

    render() {
        return (
            <>
                <Form onSubmit={this.handleSubmit.bind(this)}>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Title</Form.Label>
                        <Form.Control name="title" type="text" placeholder="Enter title" onChange={(e: ChangeEvent) => {
                            this.setState({title: e})
                        }}/>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Post content</Form.Label>
                        <Form.Control name="content" as={"textarea"} onChange={(e: ChangeEvent) => {
                            this.setState({content: e})
                        }}/>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formFileMultiple">
                        <Form.Label>Upload photos</Form.Label>
                        <Form.File name="files" multiple accept="image/*" onChange={(e: ChangeEvent) => {
                            this.setState({files: (e.target as HTMLInputElement).files})
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