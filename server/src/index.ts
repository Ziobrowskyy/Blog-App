import express, {Request, Response} from "express"
import cors from "cors"
import multer from "multer"
import {GridFsStorage} from "multer-gridfs-storage"
import * as Database from "./Database"
import {API} from "./API"
import path from "path"
import dotenv from "dotenv";
import ExpressWs from "express-ws";

//express app and port to run at
const app = express()
const appWS = ExpressWs(app);

dotenv.config()

app.set("port", process.env.PORT || 3000)

//routing static files (including images)
if (process.env.FILE_SAVE == "LOCAL")
    app.use("/static", express.static("uploads"))
//body parser use to handle request
app.use(express.json())
app.use(express.urlencoded())
app.use(cors())
app.use(express.static(path.join(__dirname, "../../client/build")));

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

Database.init(err => {
    console.warn("Failed to connect to database!")
    throw(err)
})

if (process.env.FILE_SAVAE == "DATABASE") {
    app.post("/api/post", gridFSImageUpload, API.createPost)
}
else
    app.post("/api/post", localImageUpload, API.createPost)

app.put("/api/post/:id", API.updatePost)
app.delete("/api/post/:id", API.deletePost)
app.get("/api/post/:id", API.getPost)
app.get("/api/posts", API.getAllPosts)

app.post("/api/login", API.login)

if (process.env.FILE_SAVE == "DATABASE")
    app.get("/static/:filename", API.getFile)

app.get("/*", (req: Request, res:Response) => {
    res.sendFile(path.join(__dirname, "../../client/build/index.html"));
});

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
});
