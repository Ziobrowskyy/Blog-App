import express from "express"
import cors from "cors"
import multer from "multer"
import {GridFsStorage} from "multer-gridfs-storage"
import Database from "./Database"
import API from "./API"
import path from "path"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import User from "./auth/UserAuth"
import Session from "./web/Session"
import {Site} from "./Site"

//express app and port to run at
const app = express()

dotenv.config()

app.set("port", process.env.PORT || 3000)

//routing static files (including images)
if (process.env.FILE_SAVE == "LOCAL")
    app.use("/static", express.static("uploads"))

app.use(express.json())
app.use(express.urlencoded())
app.use(cors())
app.use(cookieParser())

//serve client files from build path
app.use(express.static(path.join(__dirname, "../../client/build")))

//init session
app.use(Session.init())

//file save handling locally
const localStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/")
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
    })
})

const localImageUpload = multer({storage: localStorage}).array("files")
const gridFSImageUpload = multer({storage: gridFSStorage}).array("files")

Database.init().catch(reason => process.exit(reason))

app.post("/api/status", API.status)

if (process.env.FILE_SAVE == "DATABASE")
    app.post("/api/post", User.auth(), gridFSImageUpload, API.createPost)
else
    app.post("/api/post", User.auth(), localImageUpload, API.createPost)

app.put("/api/post/:id", User.auth(), API.updatePost)
app.delete("/api/post/:id", User.auth(), API.deletePost)
app.get("/api/post/:id", API.getPost)
app.get("/api/posts", API.getAllPosts)

app.post("/api/login", User.unauth(), API.login)
app.post("/api/logout", User.auth(), API.logout)
app.post("/api/register", API.register)

if (process.env.FILE_SAVE == "DATABASE")
    app.get("/static/:filename", API.getFile)

app.get("/", Site.index)

app.get("/about", Site.index)

app.get("/profile/me", User.auth("/"), Site.index)

app.get("/login", User.unauth("/"), Site.index)

app.get("/admin-panel", User.auth("/"), Site.index)

//app.get("/*", Site.index);

app.listen(process.env.PORT, () => console.log(`Server is running on port ${process.env.PORT}`))
