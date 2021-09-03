import React, {Component} from 'react';
import {Button, Card, CardColumns, CardImg, Carousel, CarouselItem} from "react-bootstrap";

interface Props {
    data: Data
}

interface Data {
    hasContent: boolean;
    hasFiles: boolean;
    title: String;
    content: String;
    files: Array<URL>
}

export class Post extends Component<Props> {

    render() {
        const {data} = this.props
        console.log(data)
        return (
            <Card style={{width: '18rem'}}>
                {data.hasFiles && <RenderImages images={data.files}/>}
                <Card.Body>
                    <Card.Title>{data.title}</Card.Title>
                    <Card.Text>
                        {/*Has images: {data.hasImages.toString()}<br/>*/}
                        {/*Has content: {data.hasContent.toString()}<br/>*/}
                        {data.content}
                    </Card.Text>
                    <Button variant="primary">Go somewhere</Button>
                </Card.Body>
            </Card>
        );
    }
}

function RenderImages(props: { images: Array<URL> }) {
    const {images} = props

    if (images.length === 1)
        return <Card.Img variant="top" src={"static/" + images[0].toString()}/>

    const items = images.map(el =>
        <Carousel.Item>
            <img
                className={"d-block w-100"}
                src={"static/" + el.toString()}
            />
        </Carousel.Item>
    )

    return <Carousel>{items}</Carousel>

}

