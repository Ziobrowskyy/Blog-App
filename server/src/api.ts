import * as Database from "./database";
import Post from "./post";
import {Request, Response} from "express";

export function createPost(req: Request, res: Response) {
    const post = new Post({...req.body, files: req.files})

    Database.getDb().insertOne(post).then(
        (successResult) => {
            res.status(200).json({
                "success": true,
                "message": successResult
            })
        },
        (failMessage) => {
            res.status(400).json({
                "success": false,
                "message": "Failed to add data to database. " + failMessage
            })
        })
}

export function createPostAndSaveFiles(req: Request, res: Response) {
    console.log("body -> files")
    console.log(req.body.files)
    console.log("body")
    console.log(req.body)
    res.json({"message": "OK"})
}

export function updatePost(req: Request, res: Response) {
    const postId = req.body.id
    if (!req.body.params.id) {
        res.status(400).json({
            "success": false,
            "message": "Missing body parameters"
        })
    }
    Database.getDb().updateOne(
        {_id: postId},
        {}
    ).then(
        (successResult) => {
            res.status(200).json({
                "success": true,
                "message": successResult
            })
        },
        (failMessage) => {
            res.status(400).json({
                "success": false,
                "message": "Failed to update. " + failMessage
            })
        })
}

export async function deletePost(req: Request, res: Response) {
    const result = await Database.getDb().deleteOne({_id: req.body.id}).then(
        (successResult) => {
            res.status(200).json({
                "success": true,
                "message": successResult
            })
        },
        (failMessage) => {
            res.status(400).json({
                "success": false,
                "message": "Failed to delete document. " + failMessage
            })
        })
    console.log(result)
}

export async function getPost(req: Request, res: Response) {
    Database.getDb().findOne({_id: req.body.id}).then(
        (successResult) => {
            res.status(200).json({
                "success": true,
                "message": successResult,
                "data": JSON.stringify(successResult)
            })
        },
        (failMessage) => {
            res.status(400).json({
                "success": false,
                "message": "Failed to find document. " + failMessage
            })
        })

}

export async function getAllPosts(req: Request, res: Response) {
    const documents = await Database.getDb().find().toArray()
    if (documents) {
        res.status(200).json({
            "success": true,
            "message": "",
            "data": JSON.stringify(documents)
        })
    } else {
        res.status(400).json({
            "success": false,
            "message": "Failed to find documents"
        })
    }
}

export async function testConnection(req: Request, res: Response) {
    const query = {}

    const options = {}

    const cursor = await Database.getDb().find(query, options)

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
