import Session from "../web/Session";
import Auth from "../web/Auth";
import AppResponse from "../web/AppResponse";

export default function AuthAction(target : Auth, property : string, descriptor : PropertyDescriptor) {

    const init : () => void = descriptor.value;

    descriptor.value = function(this : Auth) {

        try {

            this.Session.load(this.validate());

            init.call(this);

        } catch {

            new AppResponse(this.response).error(this.unauthorized).json();

        }

    }

}