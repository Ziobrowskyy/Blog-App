import {Request, Response} from "express";
import {ObjectID} from "mongodb";
import {getFilesCollection, getPostsCollection, getUsersCollection} from "./Database";
import Post from "./data/Post";
import AppResponse from "./web/AppResponse";
import User from "./models/User";
import Session from "./web/Session";

export namespace API {
    export async function createPost(req: Request, res: Response) {
        const files: string[] = [], {title,content} = req.params;

        if (req.files instanceof Array)
            files.push(...req.files.map(el => el.filename || ""));

        const post = await new Post({title,content,files}).createPost();

        return new AppResponse(res).load(post,
            send => send.success(),
            send => send.error(`Failed to add data to database. ${post.errorMessage}`)
        ).json();

    }

    export function updatePost(req: Request, res: Response) {
        const {id, content} = req.params

        if (!id || !content) {
            return new AppResponse(res).error("Missing body parameters").json()
        }

        getPostsCollection().updateOne({_id: id}, {content}).then(
            successResult => new AppResponse(res).success(JSON.stringify(successResult)).json(),
            failMessage => new AppResponse(res).error(`Failed to delete document. ${failMessage}`).json()
        )
    }

    export async function deletePost(req: Request, res: Response) {

        await getPostsCollection().deleteOne({_id: new ObjectID(req.params.id)}).then(
            successResult => new AppResponse(res).success(JSON.stringify(successResult)).json(),
            failMessage => new AppResponse(res).error(`Failed to delete document. ${failMessage}`).json()
        )

    }

    export async function getPost(req: Request, res: Response) {
        const post = await new Post({_id: req.params.id}).getPost();

        return new AppResponse(res).load(post,
            send => send.success().with(post.dataResult),
            send => send.error(`Failed to find document. ${post.errorMessage}`)
        ).json();
    }

    export async function getAllPosts(req: Request, res: Response) {
        const posts = await new Post().fetchAll();

        return new AppResponse(res).load(posts,
            send => send.success().with(posts.dataResult),
            send => send.error("Failed to find documents")
        ).json();
    }

    export async function getFile(req: Request, res: Response) {
        const {filename} = req.params
        const files = await getFilesCollection().find({filename: filename}).toArray()

        if (files.length == 0)
            new AppResponse(res).error("Failed to find file").json()
        else
            getFilesCollection().openDownloadStreamByName(filename).pipe(res)
    }

    export async function login(req: Request, res: Response) {
        const {username, password} = req.body

        const user = await new User({ username, password }).login();

        return new AppResponse(res).load(user, 
            send => send.success('OK').save('uid', user._id as string),
            send => send.error(user.errorMessage as string)
        ).json();
    }

}
