import {Collection, MongoClient, MongoError} from "mongodb";
import dotenv from "dotenv"

dotenv.config()

// const mongoUrl = 'mongodb://localhost:27017'
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.bolnn.mongodb.net`

const connectionOptions = "?retryWrites=true&w=majority"
const dbName = 'blog-app'
const collectionName = "entries"

const client = new MongoClient(`${uri}/${dbName}${connectionOptions}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

let collection: Collection<any> | undefined = undefined

function init(callback: ((err: MongoError) => void) | undefined = undefined) {
    client.connect((err, db) => {
        if (err) {
            console.warn(err);
            if (callback) callback(err)
        }
        collection = db.db(dbName).collection(collectionName)
    })
}

function getDb(): Collection<any> {
    if (!collection)
        throw new Error("MongoDB collection must be initialized first!")
    return collection
}

export {
    init,
    getDb
}
