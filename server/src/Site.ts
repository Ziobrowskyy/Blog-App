import {Request, Response} from "express"
import AppResponse from "./web/AppResponse"

export class Site {
    static index(request: Request, response: Response) : void {
        return new AppResponse(response).indexSite(__dirname)
    }
}