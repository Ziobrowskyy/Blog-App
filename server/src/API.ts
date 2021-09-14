import {Request, Response} from "express"
import {ObjectID} from "mongodb"
import {Readable} from "stream"
import {getFilesCollection, getPostsCollection} from "./Database"
import Post from "./data/Post"
import AppResponse from "./web/AppResponse"
import User from "./models/User"

interface ICacheMap {
    [key: string]: Readable
}

const imageCache: ICacheMap = {}

export default class API {

<<<<<<< Updated upstream
    export async function status(req: Request, res: Response) {
        const user = await new User({_id: req.Session.uid}).exist()
=======
    /*export async function status(req : Request, res : Response) {
        const user = await new User({ _id: req.Session.uid }).exist();
>>>>>>> Stashed changes

        return new AppResponse(res).load(user, send => send.success(), send => send.error()).json()
    }*/

<<<<<<< Updated upstream
    export async function createPost(req: Request, res: Response) {
        const files: string[] = []
        const {title, content} = req.params
=======
    static async createPost(req: Request, res: Response) {
        const files: string[] = [], {title,content} = req.params;
>>>>>>> Stashed changes

        if (req.files instanceof Array)
            files.push(...req.files.map(el => el.filename || ""))

        const post = await new Post({title, content, files}).createPost()

        return new AppResponse(res).load(post,
            send => send.success(),
            send => send.error(`Failed to add data to database. ${post.errorMessage}`)
        ).json()
    }

    static updatePost(req: Request, res: Response) {
        const {id, content} = req.params

        if (!id || !content) {
            return new AppResponse(res).error("Missing body parameters").json()
        }

        getPostsCollection().updateOne({_id: id}, {content}).then(
            successResult => new AppResponse(res).success(JSON.stringify(successResult)).json(),
            failMessage => new AppResponse(res).error(`Failed to delete document. ${failMessage}`).json()
        )
    }

    static async deletePost(req: Request, res: Response) {

        await getPostsCollection().deleteOne({_id: new ObjectID(req.params.id)}).then(
            successResult => new AppResponse(res).success(JSON.stringify(successResult)).json(),
            failMessage => new AppResponse(res).error(`Failed to delete document. ${failMessage}`).json()
        )

    }

<<<<<<< Updated upstream
    export async function getPost(req: Request, res: Response) {
        const post = await new Post({_id: req.params.id}).getPost()
=======
    static async getPost(req: Request, res: Response) {
        const post = await new Post({_id: req.params.id}).getPost();
>>>>>>> Stashed changes

        return new AppResponse(res).load(post,
            send => send.success().with(post.dataResult),
            send => send.error(`Failed to find document. ${post.errorMessage}`)
        ).json()
    }

<<<<<<< Updated upstream
    export async function getAllPosts(req: Request, res: Response) {
        const posts = await new Post().fetchAll()
=======
    static async getAllPosts(req: Request, res: Response) {
        const posts = await new Post().fetchAll();
>>>>>>> Stashed changes

        return new AppResponse(res).load(posts,
            send => send.success().with(posts.dataResult),
            send => send.error("Failed to find documents")
        ).json()
    }

    static async getFile(req: Request, res: Response) {
        const {filename} = req.params
        const files = await getFilesCollection().find({filename: filename}).toArray()

        if (files.length == 0)
            new AppResponse(res).error("Failed to find file").json()
        else {
            let stream: Readable
            const readable = new Readable()

            if (imageCache.hasOwnProperty(filename))
                stream = imageCache[filename]
            else
                stream = getFilesCollection().openDownloadStreamByName(filename)

            res.header("transfer-encoding", "chunked")

            stream.on("data", (chunk) => {
                readable.push(chunk)
                res.write(chunk)
            })

            stream.on("end", () => {
                readable.push(null)
                imageCache[filename] = readable
                res.end()
            })
        }
    }

    static async login(req: Request, res: Response) {
        const {id,username,password} = req.body
        console.log(await new User({id,username,password}).login());
        res.status(200).send('foo')
        /*const {username, password} = req.body

        const user = await new User({username, password}).login()

        return new AppResponse(res, req).load(user,
            send => send.success().save("uid", user.dataResult._id),
            send => send.error(user.errorMessage)
<<<<<<< Updated upstream
        ).json()
    }

    export async function logout(req: Request, res: Response) {
        const {Session} = req
=======
        ).json();*/
    }

    static async logout(req: Request, res: Response) {
        const {Session} = req;
>>>>>>> Stashed changes

        Session.delete("uid")

        return new AppResponse(res).success().json()
    }

    export async function register(req: Request, res: Response) {
        const {username, password} = req.body

        if (!username || !password) {
            new AppResponse(res).error("need username and password").json()
            return
        }

        const user = new User({username, password})

        //check if user exists in db
        if (await user.findInDb()) {
            new AppResponse(res).error("User exists in database").json()
            return
        }

        const id = await user.register()

        new AppResponse(res).success(`User registration success! User id: ${id}`).json()
    }
}
