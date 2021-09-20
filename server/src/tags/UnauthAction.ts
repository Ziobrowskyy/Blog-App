import Auth from "../web/Auth"
import AppResponse from "../web/AppResponse"
import Session from "../web/Session"

export default function UnuthAction(target: Auth, property: string, descriptor: PropertyDescriptor) : void {
    const auth: (Session: Session) => void = descriptor.value
    descriptor.value = function (this: Auth) {
        try {
            this.init()
            auth.call(this, this.Session)
        } catch {
            new AppResponse(this.response).pass(this.done)
        }
    }

}