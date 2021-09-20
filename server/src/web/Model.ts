import { STRING } from "../data/String"
import { Collection, FilterQuery, ObjectID } from "mongodb"
import AfterResponse from "../tags/model/AfterResponse"
import BeforeRequest from "../tags/model/BeforeRequest"
import ModelAdapter, { AdapterTranslator, Replecer } from "./model/ModelAdapter"

type Setter = (prop : any) => void
type ModelSetup<Data> = {[ property in keyof Data ] : Setter}
const defaultReplacer = (field : any) => field

export interface ModelStructure {
    _id : ObjectID;
}

export default abstract class Model<Data, Structure extends ModelStructure> {
    protected abstract collection : Collection<Structure>
    protected translate : AdapterTranslator<Data,Structure>
    protected reverseTranslate : AdapterTranslator<Structure,Data>
    protected setup : ModelSetup<Data>
    protected lastOperation : boolean

    status : boolean
    errorMessage : string
    public constructor() {
        this.setup = {} as ModelSetup<Data>
        this.status = true
        this.errorMessage = STRING.Empty
        this.lastOperation = true
    }

    protected send(property : keyof Data, field : keyof Structure, replacer : Replecer<Data,Structure> = defaultReplacer) : void {
        this.translate[property] = {field, replacer}
    }

    protected get(property : keyof Structure, field : keyof Data, replacer : Replecer<Structure,Data> = defaultReplacer) : { set: (setter : Setter) => void } {
        this.reverseTranslate[property] = {field,replacer}
        return {set: (setter : Setter) => this.setup[field] = setter}
    }

    @BeforeRequest
    public async find(data : Partial<Data>) : Promise<this> {
        const filter = new ModelAdapter<Data,Structure>(data).mapping(this.translate).translate()
        const result = await this.collection.findOne(filter)
        if (result)
            this.response(result)
        return this
    }

    @BeforeRequest
    public async save(data : Partial<Data>) : Promise<this> {
        const filter = new ModelAdapter<Data,Structure>(data).mapping(this.translate).translate() 
        const {_id} = filter
        const result = await this.collection.findOneAndUpdate({_id} as FilterQuery<Structure>,filter,{upsert:true,returnDocument:"after"})
        if (result.value)
            this.response(result.value)
        return this
    }

    @BeforeRequest
    public async delete(data : Partial<Data>) : Promise<this> {
        const filter = new ModelAdapter<Data,Structure>(data).mapping(this.translate).translate()
        const result = await this.collection.findOneAndDelete(filter)
        if (result.value) 
            this.response(result.value)
        return this
    }

    @AfterResponse
    protected response(result : Structure) : this {
        const response = new ModelAdapter<Structure,Data>(result).mapping(this.reverseTranslate).translate()
        for (const property in response) this.setup[property](response[property])
        return this
    }

    public get success() : this {
        this.status = true
        return this
    }

    public error(message : string = STRING.Empty) : this {
        this.status = false
        this.errorMessage = message
        return this
    }

    protected abstract beforeRequest() : void;
    protected abstract afterResponse() : void;

    protected async findStatus(data : Partial<Data>) : Promise<boolean> {
        const {lastOperation} = await this.find(data)
        return lastOperation
    }

    protected async saveStatus(data : Partial<Data>) : Promise<boolean> {
        const {lastOperation} = await this.save(data)
        return lastOperation
    }

    protected async deleteStatus(data : Partial<Data>) : Promise<boolean> {
        const {lastOperation} = await this.delete(data)
        return lastOperation
    }
}