import {Collection, GridFSBucket, MongoClient} from "mongodb"
import dotenv from "dotenv"
import { UserStructure } from "./models/User"
import { PostStructure } from "models/Post"

dotenv.config()


export default class DataBase {
    protected static node : DataBase = new DataBase()
    protected static uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.bolnn.mongodb.net`
    protected static connectionOptions = "?retryWrites=true&w=majority"
    protected static dbName = "blog-app"

    protected client : MongoClient
    protected postsCollection : Collection<PostStructure>
    protected usersCollection : Collection<UserStructure>
    protected filesCollection : GridFSBucket
    protected constructor() {
        this.client = new MongoClient(DataBase.mongoURI + DataBase.connectionOptions, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
    }

    public async init() : Promise<void> {
        const db = await this.client.connect()
        const database = db.db(DataBase.dbName)
        this.postsCollection = database.collection("entries")
        this.usersCollection = database.collection("users")
        this.filesCollection = new GridFSBucket(database, {bucketName: "files"})
    }

    public static get mongoURI() : string {
        return `${DataBase.uri}/${DataBase.dbName}`
    }

    public static get posts() : Collection<PostStructure> {
        if (!this.node.postsCollection) 
            throw new Error("MongoDB collection must be initialized first!")
        return this.node.postsCollection
    }

    public static get users() : Collection<UserStructure> {
        if (!this.node.usersCollection)
            throw new Error("MongoDB collection must be initialized first!")
        return this.node.usersCollection
    }

    public static get files() : GridFSBucket {
        if (!this.node.filesCollection) 
            throw new Error("MongoDB collection must be initialized first!")
        return this.node.filesCollection
    }

    public static async init() : Promise<boolean> {
        try {
            await this.node.init()
            return true
        }
        catch (error) {
            console.error(error)
            return false
        }
    }

}

/* const mongoUrl = 'mongodb://localhost:27017'




const client = new MongoClient(mongoURI + connectionOptions, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

let postsCollection: Collection<any>
let usersCollection: Collection<UserStructure>
let filesCollection: GridFSBucket

export function init(callback: ((err: MongoError) => void) | undefined = undefined) : void {
    client.connect((err, db) => {
        if (err) {
            console.warn(err)
            if (callback) callback(err)
        }
        const database = db.db(dbName)
        postsCollection = database.collection("entries")
        usersCollection = database.collection("users")
        filesCollection = new GridFSBucket(database, {bucketName: "files"})
    })
}

export function getPostsCollection(): Collection<any> {
    if (!postsCollection)
        throw new Error("MongoDB collection must be initialized first!")
    return postsCollection
}

export function getUsersCollection(): Collection<UserStructure> {
    if (!usersCollection)
        throw new Error("MongoDB collection must be initialized first!")
    return usersCollection
}

export function getFilesCollection(): GridFSBucket {
    if (!filesCollection)
        throw new Error("MongoDB collection must be initialized first!")
    return filesCollection
}*/