import { Value } from "../types/Value"

export default interface Base {
    [property: string]: Value<Base>;
}