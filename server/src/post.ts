interface BodyType {
    title: string
    content: string
    files: Array<string>
}

class Post {
    title: string
    content: string
    files: Array<string>
    hasContent: boolean
    hasFiles: boolean

    constructor({title, content, files}: BodyType) {
        this.title = title;
        this.content = content;
        this.files = files
        this.hasContent = this.content.length > 0
        this.hasFiles = this.files.length > 0
    }
}

export default Post