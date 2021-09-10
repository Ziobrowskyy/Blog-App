import { getUsersCollection } from "../Database";
import { Property } from "../data/types/Property";
import Mediator, { BodyType } from "../web/Mediator";
import * as bcrypt from "bcrypt";
import { STRING } from "../data/String";

export interface UserBodyType extends BodyType {
    username : string;
    password : string;
}

export default class User extends Mediator  {
    username : Property<string>;
    password : Property<string>;

    public constructor({ _id, username, password } : Partial<UserBodyType>) {
        super(_id);
        this.username = username;
        this.password = password;
    }

    protected hashPassword() {

        return bcrypt.hash(this.password || STRING.Empty, 10);

    }

    public async login() : Promise<User> {
        const {username} = this, password = await this.hashPassword();

        console.log(password);

        return new Promise(Fetch => getUsersCollection().findOne({ username }).then(this.result(Fetch), this.error(Fetch)));

    }

}