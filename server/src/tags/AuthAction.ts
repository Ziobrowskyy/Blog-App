import Auth from "../web/Auth";
import AppResponse from "../web/AppResponse";
import Session from "../web/Session";

export default function AuthAction(target : Auth, property : string, descriptor : PropertyDescriptor) {

    const auth : (Session : Session) => void = descriptor.value;

    descriptor.value = function(this : Auth) {

        try {

            this.init();

            auth.call(this, this.Session);

        } catch {

            this.error(this.unauthorized);

        }

    }

}