import Base from "../data/Base";
import * as Web from "express";
import { join } from "path";
import Data from "../data/Data";
import { DataValue } from "../data/DataValue";
import { HttpStatus } from "../data/HttpStatus";
import { STRING } from "../data/String";
import DataModel from "./DataModel";

interface ModelLoadSuccess {
    (send : AppResponse) : void;
}

interface ModelLoadError {
    (send : AppResponse) : void;
}

export default class AppResponse {

    protected req : Web.Request;

    protected res : Web.Response;

    protected status : number;

    protected message : string;

    protected data : Data | Array<DataValue<Data>>;

    public constructor(res : Web.Response, req : Web.Request = Web.request) {

        this.req = req;

        this.res = res;

        this.status = 0;

        this.message = STRING.Empty;

        this.data = {};

    }

    public pass(to : Web.NextFunction, data : Base = {}) {

        Object.keys(data).map(key => this.req.Session[key] = data[key]);

        to();

    }

    public redirect(path : string) : void {

        this.res.redirect(path);

    }

    public success(message : string = STRING.Empty) : AppResponse {

        this.status = HttpStatus.OK;

        this.message = message;

        return this;

    }

    public error(message : string = STRING.Empty) : AppResponse {

        this.status = HttpStatus.BAD_REQUEST;

        this.message = message;

        return this;

    }

    public with(data : Data | Array<DataValue<Data>>) : AppResponse {

        this.data = data;

        return this;

    }

    public save(name : string, value : string = STRING.Empty) : AppResponse {

        this.req.Session.set(name, value);

        return this;

    }

    public remove(name : string) : AppResponse {

        this.req.Session.delete(name);

        return this;

    }

    public load(model : DataModel, onLoad : ModelLoadSuccess, onError : ModelLoadError) : AppResponse {

        model.status ? onLoad(this) : onError(this);

        return this;

    } 

    public json() : void {

        this.res.status(this.status).json({
            "success": this.successStatus(),
            "message": this.message,
            "data": this.data ? JSON.stringify(this.data) : this.data
        });

    }

    public html(content : string) : void {

        this.res.contentType('html').send(content);

    }

    public indexSite(root : string) : void {

        this.res.sendFile(join(root, "../../client/build/index.html"))

    }

    protected successStatus() : boolean {

        switch (this.status) {

            case HttpStatus.OK:

                return true;

            case HttpStatus.BAD_REQUEST:
            default:

                return false;

        }

    }

}