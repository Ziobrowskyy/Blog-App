import { Func } from "./Func"

export type Value<Custom> = boolean | number | string | Func | Custom | undefined | symbol | Array<Value<Custom>>;
