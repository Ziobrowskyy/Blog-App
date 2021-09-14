import {STRING} from "../data/String"
import {NextFunction, Request, Response} from "express"
import MiddlewareFunction from "../data/MiddlewareFunction"
import Session from "./Session"
import AppResponse from "./AppResponse"

export type AuthObject = new (req: Request, res: Response, next: NextFunction) => Auth

export default abstract class Auth {
    protected request: Request
    protected response: Response
    protected done: NextFunction
    protected authorized: string = "Authorized"
    protected unauthorized: string = "Unauthorized"
    protected redirect: string

    public constructor(request: Request, response: Response, done: NextFunction) {
        this.request = request
        this.response = response
        this.done = done
        this.redirect = STRING.Empty
    }

    protected fields(...fields: Array<string>): void {
        for (const field of fields)
            if (!this.Session.has(field))
                throw new Error()
    }

    public toRedirect(redirect: string): Auth {
        this.redirect = redirect

        return this
    }

    public get Session(): Session {
        return this.request.Session
    }

    public error(errorMessage: string = STRING.Empty): void {
        this.redirect ?
            new AppResponse(this.response, this.request).redirect(this.redirect) :
            new AppResponse(this.response, this.request).error(errorMessage).json()
    }

    public abstract init(): void;

    public abstract auth(Session: Session): void;

    public abstract unauth(Session: Session): void;

    public static set = (Auth: AuthObject, redirect: string): MiddlewareFunction => (req: Request, res: Response, next: NextFunction) =>
        new Auth(req, res, next).toRedirect(redirect).auth(req.Session)

    public static unset = (Auth: AuthObject, redirect: string): MiddlewareFunction => (req: Request, res: Response, next: NextFunction) =>
        new Auth(req, res, next).toRedirect(redirect).unauth(req.Session)
}