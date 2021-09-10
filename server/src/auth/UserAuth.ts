import AuthAction from "../tags/AuthAction";
import Base from "../data/Base";
import Auth from "../web/Auth";

interface Fields extends Base {
    uid : string;
}
export default class User extends Auth<Fields> {

    public validate() {

        return [ 'uid' ];

    }

    @AuthAction init() : void {
        const {Session}=this;

        
        
    }

    static auth = Auth.set(User);

}