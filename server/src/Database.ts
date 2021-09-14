import {Collection, GridFSBucket, MongoClient, MongoError} from "mongodb"
import dotenv from "dotenv"
import { UserStructure } from "./models/User"

dotenv.config()

// const mongoUrl = 'mongodb://localhost:27017'
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.bolnn.mongodb.net`

const connectionOptions = "?retryWrites=true&w=majority"
const dbName = "blog-app"

export const mongoURI = `${uri}/${dbName}`

const client = new MongoClient(mongoURI + connectionOptions, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

let postsCollection: Collection<any>
let usersCollection: Collection<UserStructure>
let filesCollection: GridFSBucket

export function init(callback: ((err: MongoError) => void) | undefined = undefined) {
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
}