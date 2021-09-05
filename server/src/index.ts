import express from "express"
import cors from "cors"
import multer from "multer"
import * as Database from "./database"
import * as api from "./api"
import path from "path";

//express app and port to run at
const app = express()
const port = 8000

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

app.use(express.static(path.join(__dirname, "../../blog-app/build")));


Database.init(err => {
    console.warn("Failed to connect to database!")
    throw(err)
})

app.post("/api/post", imageUpload, api.createPost)
app.put("/api/post/:id", api.updatePost)
app.delete("/api/post/:id", api.deletePost)
app.get("/api/post/:id", api.getPost)
app.get("/api/posts", api.getAllPosts)
app.get("/api/", api.testConnection)

// app.get("/*", (req, res) => {
//     console.log("request on /*")
//     res.sendFile(path.join(__dirname, 'build', 'index.html'));
// });

app.listen(port, () => {
    console.log(__dirname)
    // console.log(path.join(__dirname, "..", "..", "blog-app/build"))
    console.log(`Server is running on port ${port}`)
})
