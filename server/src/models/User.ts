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
    }

}