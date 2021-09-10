import Auth from "../web/Auth";
import AppResponse from "../web/AppResponse";

export default function AuthAction(target : Auth, property : string, descriptor : PropertyDescriptor) {

    const auth : () => void = descriptor.value;

    descriptor.value = function(this : Auth) {

        try {

            this.init();

            auth.call(this);

        } catch {

            new AppResponse(this.response).error(this.unauthorized).json();

        }

    }

}