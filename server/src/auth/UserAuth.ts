import AuthAction from "../tags/AuthAction";
import Auth from "../web/Auth";
import UserModel from "../models/User";
import AppResponse from "../web/AppResponse";
import { STRING } from "../data/String";

export default class User extends Auth {

    public init() {

        this.fields("uid");

    }

    @AuthAction async auth() {
        const {Session}=this;

        const user = await new UserModel({ _id: Session.uid }).exist() 
        
        user.status ? this.done() :

        new AppResponse(this.response).error(user.errorMessage || STRING.Empty).json();
        
    }

    static auth = Auth.set(User);

}