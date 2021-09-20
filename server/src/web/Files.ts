import "multer"
import { Request } from "express"

export default class Files {
    protected request : Request
    public constructor(request : Request) {
        this.request = request
    }

    public get files() : Array<Express.Multer.File> {
        return this.request.files instanceof Array ? this.request.files : []
    }

    public get names() : Array<string> {
        return this.files.map(file => file.filename)
    }
}