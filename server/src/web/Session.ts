import Base, { Value } from "../data/Base";
import { Request, Response, NextFunction } from "express";

export default class Session<Interface extends Base> {

    protected request : Request;

    protected response : Response;

    public constructor(request : Request, response : Response) {

        this.request = request;

        this.response = response;

    }

    public load(fields : Array<string>) : void {

        for (const field of fields) {

            if (field in this.request.cookies) {

                this[field] = this.request.cookies[field]

                continue;

            }

            throw new Error();

        }

    }

    public set(data : any) : void {

        for (const property in data) {

            this.response.cookie(property, data[property]);

        }

    }

    [ property : string ] : Value<Interface>

}