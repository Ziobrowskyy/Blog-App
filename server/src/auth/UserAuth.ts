import AuthAction from "../tags/AuthAction";
import Auth from "../web/Auth";
import UserModel from "../models/User";
import AppResponse from "../web/AppResponse";
import { STRING } from "../data/String";
import Session from "../web/Session";
import UnuthAction from "../tags/UnauthAction";

export default class User extends Auth {

    protected authorized : string = "You cannot make this action while you're logged user.";
    protected unauthorized : string = "Access denied";

    public init() {
        this.fields("uid");
    }

    @AuthAction async auth(Session : Session) {
        const User = await new UserModel({ _id: Session.uid }).exist(), { status, errorMessage } = User;
        status ? new AppResponse(this.response, this.request).pass(this.done, { User }) :
            this.error(errorMessage)
    }

    @UnuthAction async unauth(Session : Session) {
        const User = await new UserModel({ _id: Session.uid }).exist(), { status } = User;
        status ? this.error(this.authorized) :
            new AppResponse(this.response).pass(this.done);
    }

    static auth = (redirect : string = STRING.Empty) => Auth.set(User, redirect);
    static unauth = (redirect : string = STRING.Empty) => Auth.unset(User, redirect);

}