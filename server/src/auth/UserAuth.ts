import Auth from "../web/Auth";

export default class User extends Auth {

    uid : string;

    public validate() : Array<string> {

        return [ "uid" ];

    }

    public init() : void {
        const { Session } = this;

        Session.get();
    
        this.done();
        
    }

    static auth = Auth.set(User);

}