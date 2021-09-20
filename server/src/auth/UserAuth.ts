import AuthAction from "../tags/AuthAction"
import Auth from "../web/Auth"
import UserModel from "../models/User"
import AppResponse from "../web/AppResponse"
import {STRING} from "../data/String"
import Session from "../web/Session"
import UnuthAction from "../tags/UnauthAction"
import MiddlewareFunction from "data/MiddlewareFunction"

export default class User extends Auth {

    protected authorized = "You cannot make this action while you're logged user."
    protected unauthorized = "You must be logged user"

    public init() : void {
        this.fields("uid")
    }

    @AuthAction async auth({uid} : Session) : Promise<AppResponse> {
        const user = await new UserModel({uid}).exist()
        return new AppResponse(this.response,this.request).load(user,
            send => send.pass(this.done),
            send => send.error(this.unauthorized)
        )
    }

    @UnuthAction async unauth({uid} : Session) : Promise<AppResponse> {
        const user = await new UserModel({uid}).exist()
        return new AppResponse(this.response,this.request).load(user,
            send => send.error(this.authorized),
            send => send.pass(this.done)
        )
    }

    static auth = (redirect: string = STRING.Empty) : MiddlewareFunction => Auth.set(User, redirect)

    static unauth = (redirect: string = STRING.Empty) : MiddlewareFunction => Auth.unset(User, redirect)

}