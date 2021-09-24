import "multer"
import { Request, Response, response as res } from "express"
import { Readable } from "stream"

export interface FilesOnFinishCallback {
    (readable : Readable) : void
}

export default class Files {
    protected request : Request
    protected response : Response
    public constructor(request : Request, response? : Response) {
        this.request = request
        this.response = response || res
    }

    public get files() : Array<Express.Multer.File> {
        return this.request.files instanceof Array ? this.request.files : []
    }

    public get names() : Array<string> {
        return this.files.map(file => file.filename)
    }

}