import { Property } from "../data/types/Property";
import DataModel from "./DataModel";
import { Collection, ObjectID } from "mongodb";
import { STRING } from "../data/String";

type Fetch = (value: any | PromiseLike<any>) => void;

export interface BodyType {
    _id : Property<string>;
}

export default abstract class Mediator<DataType = any> implements DataModel<DataType> {

    protected abstract collection: Collection<any>;

    status: boolean;
    dataResult: DataType | undefined;
    errorMessage: string | undefined;
    _id: Property<ObjectID>;

    protected constructor(_id: Property<string>) {
        this._id = new ObjectID(_id);
        this.status = true;
    }

    public find(...fields: Array<string>) {
        const filter: any = {};

        fields.forEach(field => filter[field] = (this as any)[field]);

        return this.collection.findOne(filter);
    }

    public findAll(...fields: Array<string>) {
        const filter: any = {};

        fields.forEach(field => filter[field] = (this as any)[field]);

        return this.collection.find(filter).toArray();
    }

    protected success(data: DataType | undefined = undefined) {
        this.status = true;
        this.dataResult = data;
        return this;
    }

    protected except(error: string = STRING.Empty) {
        this.status = false;
        this.errorMessage = error;
        return this;
    }

    protected result = (Fetch: Fetch) => (dataResult: DataType | undefined = undefined) => {
        this.dataResult = dataResult;

        Fetch(this);
    }

    protected error = (Fetch: Fetch) => (errorMessage: string) => {
        this.status = false;
        this.errorMessage = errorMessage;
        Fetch(this);
    }
}