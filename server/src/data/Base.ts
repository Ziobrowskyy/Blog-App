export type Value<Custom> = boolean | number | string | Function | object | Custom | undefined | symbol | Array<Value<Custom>>;

export default interface Base {
    [property: string]: Value<Base>;
}