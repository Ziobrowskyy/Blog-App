<<<<<<< Updated upstream
import {getUsersCollection} from "../Database"
import {Property} from "../data/types/Property"
import Mediator, {BodyType} from "../web/Mediator"
import * as bcrypt from "bcrypt"

export interface UserBodyType extends BodyType {
    username: string;
    password: string;
}

export default class User extends Mediator {
    protected collection = getUsersCollection()
    username: Property<string>
    password: Property<string>

    public constructor({_id, username, password}: Partial<UserBodyType>) {
        super(_id)
        this.username = username
        this.password = password
    }

    private async hashPassword() {
        return bcrypt.hash(this.password as string, 10)
    }

    private checkPassword(hash: string) {
        return bcrypt.compare(this.password as string, hash)
    }

    public async login(): Promise<User> {
        const result = await this.find("username")

        if (result && await this.checkPassword(result.hash)) {
            return this.success(result)
        }

        return this.except("Wrong username or password")
    }

    async register() {
        const hash = await this.hashPassword()
        const result = await this.collection.insertOne({username: this.username, hash: hash})

        return result.insertedId
    }

    public async exist(): Promise<User> {
        const result = await this.find("_id")

        if (result && result._id) {
            return this.success()
        }

        return this.except("User doesn't exist")
    }

    public async findInDb(): Promise<boolean> {
        const result = await this.collection.findOne({username: this.username})

        return (!!result)
=======
import { getUsersCollection } from "../Database";
import * as bcrypt from "bcrypt";
import Model,{ ModelData, ModelStructure } from "../web/Model";
import { ObjectID } from "mongodb";
import { STRING } from "../data/String";

export interface UserData extends ModelData {
    username : string;
    password : string;
}

export interface UserStructure extends ModelStructure {
    username : string;
    hash : string;
}

export default class User extends Model<UserData,UserStructure> implements UserData {
    protected collection = getUsersCollection();
    
    username : string;
    password : string;
    public constructor({ id, username, password } : UserData) {
        super(id);
        this.username = username;
        this.password = password;
    }

    protected beforeRequest() : void {
        this.send("id", "_id", id => new ObjectID(id))
        this.send("username","username")
        this.send("password","hash", password => this.createHash(password))
    }

    protected afterResponse() : void {
        this.get("_id", "id").set(id => this.id=id)
        this.get("username", "username").set(username => this.username=username)
        this.get("hash", "password").set(hash => this.checkHash(hash)?0: this.password = STRING.Empty)
    }

    /*protected checkPassword(password : string) : boolean {
        return bcrypt.compareSync(this.password as string, password);
    }

    public async login() : Promise<User> {
        const result = await this.find('username');
        return result && this.checkPassword(result.hash) ? this.success(result) : this.except("Wrong username or password");
    }

    public async exist() : Promise<User> {
        const result = await this.find("_id");
        return result && result._id ? this.success(result) : this.except("User doesn't exist");
    }*/

    protected createHash(password : string) : string {
        return bcrypt.hashSync(password, 10)
    }

    protected checkHash(password : string) : boolean {
        return bcrypt.compareSync(this.password, password)
    }

    public async login() : Promise<User> {
        const {username} = this
        await this.find({username})
        if (this.password)
            return this.success
        return this.error("Error")
>>>>>>> Stashed changes
    }

}