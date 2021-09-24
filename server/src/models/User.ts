import DataBase from "../Database"
import * as bcrypt from "bcrypt"
import Model,{ ModelStructure } from "../web/Model"
import { ObjectID } from "mongodb"
import { STRING } from "../data/enums/String"

export interface UserData {
    uid : string;
    username : string;
    password : string;
}

export interface UserStructure extends ModelStructure {
    username : string;
    hash : string;
}

export default class User extends Model<UserData,UserStructure> implements UserData {
    protected collection = DataBase.users;
    
    uid : string;
    username : string;
    password : string;
    public constructor({ uid, username, password } : Partial<UserData> = {}) {
        super()
        this.uid = uid || STRING.Empty
        this.username = username || STRING.Empty
        this.password = password || STRING.Empty
    }

    protected beforeRequest() : void {
        this.send("uid", "_id", uid => new ObjectID(uid))
        this.send("username","username")
        this.send("password","hash", password => this.createHash(password))
    }

    protected afterResponse() : void {
        this.get("_id", "uid").set(id => this.uid=id)
        this.get("username", "username").set(username => this.username=username)
        this.get("hash", "password").set(hash => this.checkHash(hash)?0: this.password = STRING.Empty)
    }

    protected createHash(password : string) : string {
        return bcrypt.hashSync(password, 10)
    }

    protected checkHash(password : string) : boolean {
        return bcrypt.compareSync(this.password, password)
    }

    public async login() : Promise<User> {
        const {username} = this
        if (await this.findStatus({username}) && this.password)
            return this.success
        return this.error("Error")
    }

    public async register() : Promise<User> {
        const {username,password} = this
        if (await this.findStatus({username}) && this.uid) 
            return this.error("User already exist")
        if (!await this.saveStatus({username,password})) 
            return this.error("Cannot create user")
        return this.success
    }

    public async exist() : Promise<User> {
        const {uid} = this
        if (await this.findStatus({uid}))
            return this.success
        return this.error("User doesn't exist")
    }

}