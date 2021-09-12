import {Request, Response} from "express"
import AppResponse from "./web/AppResponse"

export namespace Site {
    export const index = (request: Request, response: Response) => new AppResponse(response).indexSite(__dirname)
}