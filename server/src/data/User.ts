import {Collection} from "mongodb";
import bcrypt from "bcrypt"

interface IUserBodyType {
    username: string
    password: string
}

export default class User {
    username: string
    password: string

    constructor({username, password}: IUserBodyType) {
        this.username = username
        this.password = password
    }

    private async hashPassword() {
        return bcrypt.hash(this.password, 10)
    }

    async validatePassword(hash: string) {
        return bcrypt.compare(this.password, hash)
    }

    async findInDb(collection: Collection) {
        return collection.findOne({username: this.username})
    }

    async register(collection: Collection) {
        const hash = await this.hashPassword()
        const result = await collection.insertOne({username: this.username, hash: hash})

        console.log(result)
        return result.insertedId
    }


    async login(collection: Collection): Promise<boolean> {
        const result = await this.findInDb(collection)

        return await this.validatePassword(result.hash)
    }
}