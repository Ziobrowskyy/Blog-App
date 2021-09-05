import {Collection, MongoClient, MongoError} from "mongodb";

const mongoUrl = 'mongodb://localhost:27017'
const dbName = 'portal'
const collectionName = "entries"

const client = new MongoClient(`${mongoUrl}/${dbName}/${collectionName}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

let collection: Collection<any> | undefined = undefined

function init(callback: ((err: MongoError) => void) | undefined = undefined) {
    client.connect((err, db) => {
        if (err) {
            console.warn(err);
            if(callback) callback(err)
        }
        collection = db.db(dbName).collection(collectionName)
    })
}
function getDb(): Collection<any> {
    if(!collection)
        throw new Error("MongoDB collection must be initialized first!")
    return collection
}
export {
    init,
    getDb
}
