import express from "express"
import cors from "cors"
import multer from "multer"
import * as Database from "./database"
import * as api from "./api"
import path from "path"
import dotenv from "dotenv"

//express app and port to run at
const app = express()

dotenv.config()

app.set("port", process.env.PORT || 3000)

//routing static files (including images)
app.use("/static", express.static("uploads"))
//body parser use to handle request
app.use(express.json())
app.use(express.urlencoded())
app.use(cors())

//file save handling
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
        const suffix = Date.now()
        cb(null, suffix + file.originalname)
    }
})

const imageUpload = multer({storage: storage}).array("files")

app.use(express.static(path.join(__dirname, "../../client/build")));


Database.init(err => {
    console.warn("Failed to connect to database!")
    throw(err)
})
if(process.env.ENV == "Heroku")
    app.post("/api/post", api.createPostAndSaveFiles)
else
    app.post("/api/post", imageUpload, api.createPost)
app.put("/api/post/:id", api.updatePost)
app.delete("/api/post/:id", api.deletePost)
app.get("/api/post/:id", api.getPost)
app.get("/api/posts", api.getAllPosts)
app.get("/api/", api.testConnection)

app.get("/*", (req, res) => {
    res.sendFile(path.join(__dirname, "../../client/build/index.html"));
});

app.listen(process.env.PORT, () => {
    console.log(__dirname)
    console.log(`Server is running on port ${process.env.PORT}`)
})
