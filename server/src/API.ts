import Post from "./data/Post";
import {Request, Response} from "express";
import {getFilesCollection, getPostsCollection, getUsersCollection} from "./Database";
import AppResponse from "./web/AppResponse";
import {ObjectID} from "mongodb";

export namespace API {
    export function createPost(req: Request, res: Response) {
        let filenames: string[] = []

        if (req.files instanceof Array)
            filenames = req.files.map(el => el.filename ? el.filename : "")

        const post = new Post({...req.body, files: filenames})

        getPostsCollection().insertOne(post).then(
            successResult => new AppResponse(res).success().json(),
            failMessage => new AppResponse(res).error(`Failed to add data to database. ${failMessage}`).json()
        )

    }

    export function updatePost(req: Request, res: Response) {
        const {id, content} = req.params

        if (!id || !content) {
            new AppResponse(res).error("Missing body parameters").json()
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

        getPostsCollection().findOne({_id: req.params.id}).then(
            successResult => new AppResponse(res).success(successResult).json(),
            failMessage => new AppResponse(res).error(`Failed to find document. ${failMessage}`).json()
        )
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

        try {
            getFilesCollection().openDownloadStreamByName(filename).pipe(res)
        } catch (e) {
            new AppResponse(res).error(`Failed to find file. ${e.message}`)
        }
    }

}
