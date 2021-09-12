import {DataValue} from "./DataValue"

export default interface Data {
    [key: string | number | symbol]: DataValue<Data>;
}