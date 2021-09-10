import Base from "../data/Base";
import { NextFunction, Request, Response } from "express";
import MiddlewareFunction from "../data/MiddlewareFunction";
import Session, { SessionInterface } from "./Session";

interface Fields {
    uid : string;
}

export default abstract class Auth {

    protected request : Request;

    protected response : Response;

    protected done : NextFunction;

    protected Session : Session;

    protected unauthorized : string = "Unauthorized";

    public constructor(request : Request, response : Response, done : NextFunction) {

        this.request = request;

        this.response = response;

        this.done = done;

        this.Session = new Session(this.request, this.response);

    }

    protected fields(...fields : Array<string>) : void {

        this.Session.loadFields(fields);

    }

    public abstract init() : void;

    public abstract auth() : void;

    public static set(Auth : new (req : Request, res : Response, next : NextFunction) => Auth) : MiddlewareFunction {

        return (req : Request, res : Response, next : NextFunction) => new Auth(req, res, next).auth();

    }

}