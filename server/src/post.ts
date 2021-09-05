interface BodyType {
    title: string
    content: string
    files: Array<Express.Multer.File> | undefined
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

        this.files = []
        if (files instanceof Array)
            this.files = files.map(it => it.filename ? it.filename : "")

        this.hasContent = this.content.length > 0
        this.hasFiles = this.files.length > 0
    }
}

export default Post