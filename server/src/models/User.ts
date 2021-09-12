import { getUsersCollection } from "../Database";
import { Property } from "../data/types/Property";
import Mediator, { BodyType } from "../web/Mediator";
import * as bcrypt from "bcrypt";

export interface UserBodyType extends BodyType {
    username : string;
    password : string;
}

export default class User extends Mediator  {
    protected collection = getUsersCollection();
    username : Property<string>;
    password : Property<string>;

    public constructor({ _id, username, password } : Partial<UserBodyType>) {
        super(_id);
        this.username = username;
        this.password = password;
    }

    protected checkPassword(password : string) : boolean {
        return bcrypt.compareSync(this.password as string, password);
    }

    public async login() : Promise<User> {
        const result = await this.find('username');
        return result && this.checkPassword(result.hash) ? this.success(result) : this.except("Wrong username or password");

    }

    public async exist() : Promise<User> {
        const result = await this.find("_id");
        return result && result._id ? this.success(result) : this.except("User doesn't exist");

    }

}