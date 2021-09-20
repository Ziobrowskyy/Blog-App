import { AdapterTranslator } from "../../web/model/ModelAdapter"
import Model, { ModelStructure } from "../../web/Model"

export default function BeforeRequest<Data,Structure extends ModelStructure>(target : Model<Data,Structure>, property : string, descriptor : PropertyDescriptor) : void {
    const method : <Keys extends keyof Data>(data : Pick<Data,Keys>) => Promise<Model<Data,Structure>> = descriptor.value
    descriptor.value = function<Keys extends keyof Data>(this : Model<Data,Structure>, data : Pick<Data,Keys>) : Promise<Model<Data,Structure>> {
        this.translate = {} as AdapterTranslator<Data,Structure>
        this.lastOperation = false
        this.beforeRequest()
        return method.call(this, data)
    }
}