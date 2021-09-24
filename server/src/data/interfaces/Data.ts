import {DataValue} from "../types/DataValue"

export default interface Data {
    [key: string | number | symbol]: DataValue<Data>;
}