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

        if (result && this.checkPassword(result.hash)) {

            return this.success();

        }

        return this.except("Wrong username or password");

    }

    public async exist() : Promise<User> {
        
        const result = await this.find("_id");

        if (result && result._id) {

            return this.success();

        }

        return this.except("User doesn't exist");

    }

}