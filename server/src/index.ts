import express from "express"
import cors from "cors"
import multer from "multer"
import {GridFsStorage} from "multer-gridfs-storage"
import * as Database from "./database"
import * as api from "./api"
import path from "path"
import dotenv from "dotenv"

//express app and port to run at
const app = express()

dotenv.config()

app.set("port", process.env.PORT || 3000)

//routing static files (including images)
if (process.env.ENV != "Heroku" && false)
    app.use("/static", express.static("uploads"))
//body parser use to handle request
app.use(express.json())
app.use(express.urlencoded())
app.use(cors())

//file save handling locally
const localStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
        const suffix = Date.now()
        cb(null, suffix + file.originalname)
    }
})

//file saving on MongoDB
const gridFSStorage = new GridFsStorage({
    url: Database.mongoURI,
    file: ((request, file) => {
            const suffix = Date.now()
            return {
                filename: suffix + file.originalname,
                bucketName: "files"
            }
        }
    )
})

const localImageUpload = multer({storage: localStorage}).array("files")
const gridFSImageUpload = multer({storage: gridFSStorage}).array("files")

app.use(express.static(path.join(__dirname, "../../client/build")));

Database.init(err => {
    console.warn("Failed to connect to database!")
    throw(err)
})

if (process.env.ENV == "Heroku" || true)
    app.post("/api/post", gridFSImageUpload, api.createPost)
else
    app.post("/api/post", localImageUpload, api.createPost)
app.put("/api/post/:id", api.updatePost)
app.delete("/api/post/:id", api.deletePost)
app.get("/api/post/:id", api.getPost)
app.get("/api/posts", api.getAllPosts)
app.get("/api/", api.testConnection)

if (process.env.ENV == "Heroku" || true)
    app.all("/static/:filename", api.getFile)

app.get("/*", (req, res) => {
    res.sendFile(path.join(__dirname, "../../client/build/index.html"));
});

app.listen(process.env.PORT, () => {
    console.log(__dirname)
    console.log(`Server is running on port ${process.env.PORT}`)
})
