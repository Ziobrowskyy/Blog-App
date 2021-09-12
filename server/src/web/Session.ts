import MiddlewareFunction from "data/MiddlewareFunction";
import { NextFunction, Request, Response } from "express";
import { STRING } from "../data/String";

export interface SessionInterface {
    loadFields(fields : Array<string>) : void;
    has(name : string) : boolean;
    get(name : string) : string;
    set(name : string, value : string) : void;
    delete(name : string) : void;
}

export default class Session implements SessionInterface {

    protected static settings = { httpOnly: true }

    protected request : Request;

    protected response : Response;

    protected fields : Array<string>;

    [ property : string ] : any;

    public constructor(request : Request, response : Response) {

        this.request = request;

        this.response = response;

        this.fields = [];

    }

    protected createField(field : string) : void {

        Object.defineProperty(this, field, {
            get: () => this.get(field),
            set: (value : string) => this.set(field, value)
        });

    }

    public loadFields(fields : Array<string>) : void {

        for (const field of fields) {

            if (!this.has(field)) 
                throw new Error();

            this.createField(field);

        }

    }

    public has(name : string) : boolean {

        return name in this.request.cookies;

    }

    public get(name : string) : string {

        return this.request.cookies[name];

    }

    public set(name : string, value : string) : void {

        this.request.cookies[name] = value;

        this.response.cookie(name, value, { ...Session.settings });

    }

    public delete(name : string) : void {

        delete this.request.cookies[name];

        this.response.cookie(name, STRING.Empty, { expires: new Date(), ...Session.settings });

    }

    public static init() : MiddlewareFunction {

        return (req : Request, res : Response, next : NextFunction) => {

            req.Session = new Session(req, res);

            req.Session.loadFields(Object.keys(req.cookies));

            next();

        }

    }

}