import Post from "./post";
import {Request, Response} from "express";
import {getFilesCollection, getPostsCollection} from "./database";
import AppResponse from "./web/AppResponse";
import { ObjectID } from "mongodb";

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

    getPostsCollection().updateOne({_id: id},{content}).then(
        successResult => new AppResponse(res).success().json(),
        failMessage =>  new AppResponse(res).error(`Failed to delete document. ${failMessage}`).json()
    )
}

export async function deletePost(req: Request, res: Response) {

    await getPostsCollection().deleteOne({_id: new ObjectID(req.params.id)}).then(
        successResult => new AppResponse(res).success().json(),
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
        new AppResponse(res).error("Failed to find documents").with(documents).json();
        
    }
}

export async function testConnection(req: Request, res: Response) {
    const query = {}

    const options = {}

    const cursor = await getPostsCollection().find(query, options)

    const data = await cursor.map(it => {
        return {
            title: it.title,
            content: it.content,
            type: it.content,
            images: it.images
        }
    }).toArray()
    res.json(data)
}

export async function getFile(req: Request, res: Response) {
    const {filename} = req.params
    const files = await getFilesCollection().find({filename: filename}).toArray()
    if (files.length == 0)
        res.status(500).json({
            "success": false,
            "message": "Failed to find documents"
        })

    try {
        getFilesCollection().openDownloadStreamByName(filename).pipe(res)
    } catch (e) {
        res.status(500).json({
            "success": false,
            "message": "Failed to find documents" + e.message
        })
    }
}
