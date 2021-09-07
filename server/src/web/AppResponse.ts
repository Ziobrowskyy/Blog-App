import * as Web from "express";
import Data from "../data/Data";
import { DataValue } from "../data/DataValue";
import { HttpStatus } from "../data/HttpStatus";
import { STRING } from "../data/String";

export default class AppResponse {

    protected res : Web.Response;

    protected status : number;

    protected message : string;

    protected data : Data | Array<DataValue<Data>>;

    public constructor(res : Web.Response) {

        this.res = res;

        this.status = 0;

        this.message = STRING.Empty;

        this.data = {};

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

    public json() : void {

        this.res.status(this.status).json({
            "success": this.successStatus(),
            "message": this.message,
            "data": this.data ? JSON.stringify(this.data) : this.data
        });

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