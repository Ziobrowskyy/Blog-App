import {Collection, GridFSBucket, MongoClient, MongoError} from "mongodb"
import dotenv from "dotenv"
import PropertyPromiseWrapper from "./wrappers/PropertyPromiseWrapper"

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

let postsCollection: Collection<any> | undefined = undefined
let usersCollection: Collection<any> | undefined = undefined
let filesCollection: GridFSBucket | undefined = undefined

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

        clearDatabase()
    })
}

async function clearDatabase() {
    const filesUsed = Array()

    await postsCollection!.find({}).forEach(post => {
        filesUsed.push(...post.files)
    })

    const filesToRemove = Array()

    await filesCollection!.find({}).forEach(file => {
        const filename = file.filename
        if (!filesUsed.includes(filename)) {
            filesToRemove.push(filename)
        }
    })

    filesToRemove.forEach(filename => {
        filesCollection?.find({filename: filename}).forEach(file => {
            filesCollection?.delete(file._id)
        })
    })
}

export function getFiles(): Promise<GridFSBucket> {
    return PropertyPromiseWrapper(() => filesCollection)
}

export function getPosts(): Promise<Collection<any>> {
    return PropertyPromiseWrapper(() => postsCollection)
}

export function getUsers(): Promise<Collection<any>> {
    return PropertyPromiseWrapper(() => usersCollection)
}