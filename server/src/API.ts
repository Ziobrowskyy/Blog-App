import Post from "./data/Post";
import {Request, Response} from "express";
import {getFilesCollection, getPostsCollection, getUsersCollection} from "./Database";
import AppResponse from "./web/AppResponse";
import {ObjectID} from "mongodb";
import {Readable} from "stream";

interface ICacheMap {
    [key: string]: Readable
}

export namespace API {
    const imageCache: ICacheMap = {}

    export async function createPost(req: Request, res: Response) {
        const files: string[] = [];

        if (req.files instanceof Array)
            files.push(...req.files.map(el => el.filename || ""));


        const post = await new Post({...req.body, files}).createPost();

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
        const post = await new Post({_id: req.params.id, ...req.body}).getPost();

        return new AppResponse(res).load(post,
            send => send.success(post.dataResult),
            send => send.error(`Failed to find document. ${post.errorMessage}`)
        );
    }

    export async function getAllPosts(req: Request, res: Response) {
        const documents = await getPostsCollection().find().toArray()

        if (documents) {
            new AppResponse(res).success().with(documents).json();
        } else {
            new AppResponse(res).error("Failed to find documents").json();
        }
    }

    export async function getFile(req: Request, res: Response) {
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

            res.header("transfer-encoding", "chunked");

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

    export async function login(req: Request, res: Response) {
        const {login, password} = req.body

        if (!login || !password)
            new AppResponse(res).error("Login and password is required!").json()

        const user = await getUsersCollection().findOne({username: login})
        console.log(user)
        // if (!user) {
        //     new AppResponse(res).error("Cannot find user in database").json()
        // }


        new AppResponse(res).success("OK").json()
    }
}
