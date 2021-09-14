export type Replecer<Entry,Result> = (key : Entry[keyof Entry]) => Result[keyof Result]

export type AdapterTranslator<Entry,Result> = {
    [dataField in keyof Entry] : {
        field : keyof Result, 
        replacer : Replecer<Entry,Result>
    }
}

export default class ModelAdapter<Entry,Result> {

    protected data : Entry;
    protected map : AdapterTranslator<Entry,Result>;
    protected result : Result;

    public constructor(data : Partial<Entry>) {
        this.data = data as Entry
        this.map = {} as AdapterTranslator<Entry,Result>
        this.result = {} as Result
    }

    public mapping(map : AdapterTranslator<Entry,Result>) : ModelAdapter<Entry,Result> {
        this.map = map;
        return this;
    }

    public translate() : Result {
        for (const key in this.data) if (key in this.map) this.result[this.map[key].field] = this.map[key].replacer(this.data[key]);
        return this.result;
    }

}