import { Property } from "../data/types/Property";
import DataModel from "./DataModel";
import { Collection } from "mongodb";
import { STRING } from "../data/String";

type Fetch = (value: any | PromiseLike<any>) => void;

export interface BodyType {
    _id : Property<string>;
}

export default abstract class Mediator<DataType = any> implements DataModel<DataType>, BodyType {

    protected abstract collection : Collection<any>;

    status : boolean;

    dataResult : DataType | null;

    errorMessage : string | null;

    _id : Property<string>;

    public constructor(_id : Property<string>) {

        this._id = _id;

        this.status = true;

        this.dataResult = null;

        this.errorMessage = null;

    }

    public find(...fields : Array<string>) {

        let filter : any = {};

        fields.forEach(field => filter[field] = (this as any)[field]);

        return this.collection.findOne(filter);        

    }

    public findAll(...fields : Array<string>) {

        let filter : any = {};

        fields.forEach(field => filter[field] = (this as any)[field]);

        return this.collection.find(filter).toArray();        

    }

    protected success(data : DataType | null = null) {

        this.status = true;

        this.dataResult = data;

        return this;

    }

    protected except(error : string = STRING.Empty) {

        this.status = false;

        this.errorMessage = error;

        return this;

    }

    protected result = (Fetch : Fetch) => (dataResult : DataType | null = null) => {

        this.dataResult = dataResult;

        Fetch(this);

    }

    protected error = (Fetch : Fetch) => (errorMessage : string) => {

        this.status = false;

        this.errorMessage = errorMessage;

        Fetch(this);

    }

}