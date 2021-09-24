import Base from "../data/interfaces/Base"
import * as Web from "express"
import {join} from "path"
import Data from "../data/interfaces/Data"
import {DataValue} from "../data/types/DataValue"
import {HttpStatus} from "../data/enums/HttpStatus"
import {STRING} from "../data/enums/String"
import Model, { ModelStructure } from "./Model"
import { Readable } from "stream"

interface ModelLoadSuccess {
    (send: AppResponse) : void;
}

interface ModelLoadError {
    (send: AppResponse) : void;
}

export default class AppResponse {
    protected req: Web.Request
    protected res: Web.Response
    protected status: number
    protected message: string
    protected data: Data | Array<DataValue<Data>>

    public constructor(res: Web.Response, req: Web.Request = Web.request) {
        this.req = req
        this.res = res
        this.status = 0
        this.message = STRING.Empty
        this.data = {}
    }

    public pass(next: Web.NextFunction, data: Base = {}) : void {
        Object.keys(data).map(key => this.req.Session[key] = data[key])
        next()
    }

    public redirect(path: string): void {
        this.res.redirect(path)
    }

    public success(message: string = STRING.Empty, status : HttpStatus = HttpStatus.OK): AppResponse {
        this.status = status
        this.message = message
        return this
    }

    public error(message: string = STRING.Empty, status : HttpStatus = HttpStatus.BAD_REQUEST): AppResponse {
        this.status = status
        this.message = message
        return this
    }

    public with(data: Data | Array<DataValue<Data>>): AppResponse {
        this.data = data
        return this
    }

    public save(name: string, value: string = STRING.Empty): AppResponse {
        this.req.Session.set(name, value)
        return this
    }

    public remove(name: string): AppResponse {
        this.req.Session.delete(name)
        return this
    }

    public load<Data,Structure extends ModelStructure>(model: Model<Data,Structure>, onLoad: ModelLoadSuccess, onError: ModelLoadError): AppResponse {
        model.status ? onLoad(this) : onError(this)
        return this
    }

    public multiLoad<Data,Structure extends ModelStructure>(models : Array<Model<Data,Structure>>, onLoad: ModelLoadSuccess, onError: ModelLoadError) : AppResponse {
        models.filter(model => model.status).length === models.length ? onLoad(this) : onError(this)
        return this
    }

    public stream(stream : Readable, onFinish? : (readable : Readable) => void) : void {
        const readable = new Readable()
        this.res.header("transfer-encoding", "chunked")
        stream.on("data", data => {
            readable.push(data)
            this.res.send(data)
        })
        stream.on("end", () => {
            readable.push(null)
            if (onFinish) onFinish(readable)
            this.res.end()
        })
    }

    public json(): void {
        this.res.status(this.status).json({
            "success": this.successStatus(),
            "message": this.message,
            "data": this.data ? JSON.stringify(this.data) : this.data
        })
    }

    public html(content: string): void {
        this.res.contentType("html").send(content)
    }

    public indexSite(root: string): void {
        this.res.sendFile(join(root, "../../client/build/index.html"))
    }

    protected successStatus(): boolean {
        switch (this.status) {
        case HttpStatus.OK:
            return true
        case HttpStatus.BAD_REQUEST:
        default:
            return false
        }
    }
}