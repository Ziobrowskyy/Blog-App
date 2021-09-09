import { Request, Response, NextFunction } from "express";

export default class Session {

    protected cookies : any;

    public constructor(cookies : any) {

        this.cookies = cookies;

    }

    public get() {

        console.log(this.cookies);

    }

}