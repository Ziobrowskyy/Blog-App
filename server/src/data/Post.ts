import {getPostsCollection} from "../Database"
import {PostAction} from "../mediators/Post"
import Mediator, {BodyType} from "../web/Mediator"
import {Property} from "./types/Property"

export interface PostBodyType extends BodyType {
    title: string
    content: string
    files: Array<string>
}

class Post extends Mediator implements PostAction {
    protected collection = getPostsCollection()
    title: Property<string>
    content: Property<string>
    files: Property<Array<string>>
    hasContent: Property<boolean>
    hasFiles: Property<boolean>

    constructor({_id, title, content, files}: Partial<PostBodyType> = {}) {
        super(_id)
        this.title = title
        this.content = content
        this.files = files
        this.hasContent = (this.content?.length || 0) > 0
        this.hasFiles = (this.files?.length || 0) > 0
    }

    public createPost(): Promise<Post> {
        const {title, content, files, hasContent, hasFiles} = this

        return new Promise(Fetch => this.collection.insertOne({title, content, files, hasContent, hasFiles}).then(this.result(Fetch), this.error(Fetch)))
    }

    public getPost(): Promise<Post> {
        const {_id} = this

        return new Promise(Fetch => this.collection.findOne({_id}).then(this.result(Fetch), this.error(Fetch)))
    }

    public fetchAll(): Promise<Post> {

        return new Promise(Fetch => this.collection.find().toArray().then(this.result(Fetch), this.error(Fetch)))
    }
}

export default Post