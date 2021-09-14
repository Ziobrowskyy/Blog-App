import { STRING } from "../data/String";
import { Collection, FilterQuery, ObjectID, OptionalId } from "mongodb"
import AfterResponse from "../tags/model/AfterResponse";
import BeforeRequest from "../tags/model/BeforeRequest";
import ModelAdapter, { AdapterTranslator, Replecer } from "./model/ModelAdapter";

type Setter<Data> = (prop : Data[keyof Data]) => void
type ModelSetup<Data> = {[ property in keyof Data ] : Setter<Data>}

export interface ModelData {
    id : string;
}

export interface ModelStructure {
    _id : ObjectID;
}

export default abstract class Model<Data extends ModelData, Structure extends ModelStructure> implements ModelData {
    protected abstract collection : Collection<Structure>
    protected translate : AdapterTranslator<Data,Structure>
    protected reverseTranslate : AdapterTranslator<Structure,Data>
    protected setup : ModelSetup<Data>
    protected status : boolean
    protected errorMessage : string

    id : string
    public constructor(id : string) {
        this.id = id
        this.setup = {} as ModelSetup<Data>
        this.status = true
        this.errorMessage = STRING.Empty
    }

    protected send(property : keyof Data, field : keyof Structure, replacer : Replecer<Data,Structure> = (field : any) => field) : void {
        this.translate[property] = {field, replacer}
    }

    protected get(property : keyof Structure, field : keyof Data, replacer : Replecer<Structure,Data> = (field : any) => field)  {
        this.reverseTranslate[property] = {field,replacer}
        return {set: (setter : Setter<Data>) => this.setup[field] = setter}
    }

    @BeforeRequest
    public find(data : Partial<Data>) : Promise<Model<Data,Structure>> {
        const filter = new ModelAdapter<Data,Structure>(data).mapping(this.translate).translate();
        return new Promise(resolve => this.collection.findOne(filter).then(result => {
            if (result) this.response(result)
            resolve(this)
        }))
    }

    @BeforeRequest
    public save(data : Partial<Data>) : Promise<Model<Data,Structure>> {
        const filter = new ModelAdapter<Data,Structure>(data).mapping(this.translate).translate(), { _id } = filter;
        return new Promise(resolve => this.collection.updateOne({_id}, filter, { upsert: true }).then(() => resolve(this)))
    }

    public delete() : Promise<Model<Data,Structure>> {
        const {_id} = new ModelAdapter<Data,Structure>({ id: this.id } as Partial<Data>).mapping(this.translate).translate();
        return new Promise(resolve => this.collection.deleteOne({_id} as FilterQuery<Structure>).then(() => resolve(this)))
    }

    @AfterResponse
    protected response(result : Structure) : void {
        const response = new ModelAdapter<Structure,Data>(result).mapping(this.reverseTranslate).translate()
        for (const property in response) this.setup[property](response[property])
    }

    public get success() {
        this.status = true
        return this
    }
    public error(message : string) {
        this.status = false
        this.errorMessage = message
        return this
    }

    protected abstract beforeRequest() : void;
    protected abstract afterResponse() : void;
}