import React, {Component} from 'react';
import {Button, Card, Carousel, CloseButton} from "react-bootstrap";
import "../styles/Posts.scss"

interface IProps {
    data: PostData
    onDelete : (id : string) => Promise<void>;
}

export interface PostData {
    _id: string;
    hasContent: boolean;
    hasFiles: boolean;
    title: string;
    content: string;
    files: Array<URL>
}

export class Post extends Component<IProps> {

    public constructor(props : IProps) {
        super(props);
        this.removePost = this.removePost.bind(this);
    }

    protected removePost() : void {
        this.props.onDelete(this.props.data._id);
    }

    render() {
        const {data} = this.props
        return (
            <div className={"post"}>
                <Card.Body>
                    <Card.Title>{data.title}</Card.Title>
                    <CloseButton onClick={this.removePost} />
                    <Card.Text>{data.content}</Card.Text>
                    <Button variant="primary">Go somewhere</Button>
                </Card.Body>
                {data.hasFiles && <div className={"img-wrapper"}><RenderImages images={data.files}/></div>}
            </div>
        );
    }
}

function RenderImages(props: { images: Array<URL> }) {
    const {images} = props

    if (images.length === 1)
        return <img src={`static/${images[0].toString()}`}/>

    const items = images.map((el, i) =>
        <Carousel.Item key={i}>
            <img
                className={"d-block w-100"}
                src={`static/${el.toString()}`}
            />
        </Carousel.Item>
    )

    return <Carousel>{items}</Carousel>
}

