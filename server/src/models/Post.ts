import { ObjectID } from "mongodb"
import { STRING } from "../data/enums/String"
import DataBase from "../Database"
import Model, { ModelStructure } from "../web/Model"

export interface PostData {
    id : string
    title : string
    content : string
    files : Array<string>
    hasContent : boolean
    hasFiles : boolean
}

export interface PostStructure extends ModelStructure {
    title : string
    content : string
    files : Array<string>
    hasContent : boolean
    hasFiles : boolean
}

export default class Post extends Model<PostData,PostStructure> implements PostData {
    protected collection = DataBase.posts

    id : string
    title : string
    content : string
    files : Array<string>
    hasContent : boolean
    hasFiles : boolean
    public constructor({id,title,content,files} : Partial<PostData> = {}) {
        super()
        this.id = id || STRING.Empty
        this.title = title || STRING.Empty
        this.content = content || STRING.Empty
        this.files = files || []
        this.hasContent = content ? true : false
        this.hasFiles = files?.length ? true : false
    }

    public beforeRequest() : void {
        this.send("id", "_id", id => new ObjectID(id))
        this.send("title", "title")
        this.send("content", "content")
        this.send("hasContent", "hasContent")
        this.send("hasFiles", "hasFiles")
    }
    
    public afterResponse() : void {
        this.get("_id", "id").set(id => this.id=id)
        this.get("title", "title").set(title => this.title=title)
        this.get("content", "content").set(content => this.content=content)
        this.get("hasContent", "hasContent").set(hasContent => this.hasContent=hasContent)
        this.get("hasFiles", "hasFiles").set(hasFiles => this.hasFiles=hasFiles)
    }

    public async createPost() : Promise<Post> {
        const {title,content,files,hasContent,hasFiles} = this
        if (await this.saveStatus({title,content,files,hasContent,hasFiles}))
            return this.success
        return this.error("Cannot create post")
    } 

    public async getPost() : Promise<Post> {
        const {id} = this
        if (await this.findStatus({id}))
            return this.success
        return this.error("Cannot find post")
    }

    public async fetchAll() : Promise<Array<Post>> {
        const result = await this.collection.find().toArray()
        return result.map(post => new Post().response(post))
    }

    public async updateContent(content : string) : Promise<Post> {
        const {id} = this
        if (!await this.saveStatus({id,content}))
            return this.error("Cannot update post")
        return this.success
    }

    public async deletePost() : Promise<Post> {
        const {id} = this
        if (await this.deleteStatus({id}))
            return this.success
        return this.error("Cannot delete post")
    }
}