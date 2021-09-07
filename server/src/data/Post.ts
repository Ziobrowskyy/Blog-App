import {getPostsCollection} from "../Database"
import {PostAction} from "../mediators/Post"
import Mediator, {BodyType} from "../web/Mediator"

export interface PostBodyType extends BodyType {
    title: string
    content: string
    files: Array<string>
}

class Post extends Mediator implements PostAction {
    title: string
    content: string
    files: Array<string>
    hasContent: boolean
    hasFiles: boolean

    constructor({_id, title, content, files}: PostBodyType) {
        super(_id);
        this.title = title;
        this.content = content;
        this.files = files
        this.hasContent = this.content.length > 0
        this.hasFiles = this.files.length > 0
    }

    public createPost(): Promise<Post> {
        const {title, content, files, hasContent, hasFiles} = this;

        return new Promise(Fetch => getPostsCollection().insertOne({
            title,
            content,
            files,
            hasContent,
            hasFiles
        }).then(this.result(Fetch), this.error(Fetch)));
    }

    public getPost(): Promise<Post> {
        const {_id} = this;

        return new Promise(Fetch => getPostsCollection().findOne({_id}).then(this.result(Fetch), this.error(Fetch)));
    }
}

export default Post