import {Request, Response} from "express"
import {Readable} from "stream"
import AppResponse from "./web/AppResponse"
import User from "./models/User"
import DataBase from "./Database"
import Post from "./models/Post"
import Files from "./web/Files"

interface ICacheMap {
    [key: string]: Readable
}

const imageCache: ICacheMap = {}

export default class API {

    static async status(req: Request, res: Response) : Promise<void> {
        const {uid} = req.Session
        if (!uid)
            return new AppResponse(res).error("You are not logged").json()
        const user = await new User({uid}).exist()
        return new AppResponse(res).load(user,
            send => send.success(),
            send => send.error("You are not logged")
        ).json()
    }

    static async createPost(req: Request, res: Response) : Promise<void> {
        const {title,content} = req.params
        const files = new Files(req).names
        const post = await new Post({title,content,files}).createPost()
        return new AppResponse(res).load(post,
            send => send.success(),
            send => send.error(post.errorMessage)
        ).json()
    }

    static async updatePost(req: Request, res: Response) : Promise<void> {
        const {id, content} = req.params
        if (!id || !content) 
            return new AppResponse(res).error("Missing body parameters").json()
        const post = await new Post({id}).updateContent(content)
        return new AppResponse(res).load(post,
            send => send.success(),
            send => send.error(post.errorMessage)
        ).json()
    }

    static async deletePost(req: Request, res: Response) : Promise<void> {
        const {id} = req.params
        if (!id)
            return new AppResponse(res).error("Missing id param").json()
        const post = await new Post({id}).deletePost()
        return new AppResponse(res).load(post,
            send => send.success(),
            send => send.error(post.errorMessage)
        ).json()
    }

    static async getPost(req: Request, res: Response) : Promise<void> {
        const {id} = req.params
        const post = await new Post({id}).getPost(), {title,content,hasContent,hasFiles} = post
        return new AppResponse(res).load(post,
            send => send.success().with({id,title,content,hasContent,hasFiles}),
            send => send.error(post.errorMessage)
        ).json()
    }

    static async getAllPosts(req: Request, res: Response) : Promise<void> {
        const posts = await new Post().fetchAll()
        return new AppResponse(res).multiLoad(posts,
            send => send.success().with(posts.map(post => ({id:post.id,title:post.title,content:post.content}))),
            send => send.error("Failed to find documents")
        ).json()
    }

    static async getFile(req: Request, res: Response) : Promise<void> {
        const {filename} = req.params
        const files = await DataBase.files.find({filename}).toArray()
        if (files.length == 0)
            return new AppResponse(res).error("Failed to find file").json()
        const stream: Readable = filename in imageCache ? imageCache[filename] : DataBase.files.openDownloadStreamByName(filename)
        return new AppResponse(res).stream(stream, readable => imageCache[filename] = readable)
    }

    static async login(req: Request, res: Response) : Promise<void> {
        const {username,password} = req.body
        if (!username || !password) 
            return new AppResponse(res).error("need username and password").json()
        const user = await new User({username,password}).login()
        return new AppResponse(res,req).load(user,
            send => send.success().save("uid", user.uid),
            send => send.error(user.errorMessage)
        ).json()
    }

    static async register(req: Request, res: Response) : Promise<void> {
        const {username,password} = req.body
        if (!username || !password) 
            return new AppResponse(res).error("need username and password").json()
        const user = await new User({username,password}).register(),{uid} = user
        return new AppResponse(res,req).load(user, 
            send => send.success("Registration completed").with({uid}),
            send => send.error(user.errorMessage)
        ).json()
    }

    static async logout(req: Request, res: Response) : Promise<void> {
        const {Session} = req
        Session.delete("uid")
        return new AppResponse(res).success().json()
    }
}
