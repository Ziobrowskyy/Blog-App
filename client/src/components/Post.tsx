import React, {Component} from "react"
import {Card, CloseButton} from "react-bootstrap"
import "../styles/Post.scss"
import Carousel from "./Carousel"

interface IProps {
    data: PostData
    onDelete: (id: string) => Promise<void>;
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

    public constructor(props: IProps) {
        super(props)
        this.removePost = this.removePost.bind(this)
    }

    protected removePost(): void {
        this.props.onDelete(this.props.data._id)
    }

    render() {
        const {data} = this.props
        return (
            <div className={"post"}>
                <Card.Body>
                    <div className={"header-container"}>
                        <h1 className={"post-title"}>{data.title}</h1>
                        <div className={"button-wrapper"}>
                            <CloseButton onClick={this.removePost}/>
                        </div>
                    </div>
                    <>{data.content}</>
                    {/*<Button variant="primary">Go somewhere</Button>*/}
                </Card.Body>
                {data.hasFiles &&
                <Carousel>
                    {data.files.map(el => <img src={`static/${el}`} alt={el.toString()}/>)}
                </Carousel>}
            </div>
        )
    }
}


