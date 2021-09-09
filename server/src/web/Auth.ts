import { NextFunction, Request, Response } from "express";
import MiddlewareFunction from "../data/MiddlewareFunction";
import Session from "./Session";


export default abstract class Auth {

    protected request : Request;

    protected response : Response;

    protected done : NextFunction;

    protected Session : Session;

    public constructor(request : Request, response : Response, done : NextFunction) {

        this.request = request;

        this.response = response;

        this.done = done;

        this.Session = new Session(this.request.signedCookies);

    }

    public init() : void {

        this.done();   

    }

    public validate() : Array<string> {

        return [];

    }

    public static set(Auth : new (req : Request, res : Response, next : NextFunction) => Auth) : MiddlewareFunction {

        return (req : Request, res : Response, next : NextFunction) => new Auth(req, res, next).init();

    }

}