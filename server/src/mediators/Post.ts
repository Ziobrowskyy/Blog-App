import { ActionResult } from "src/data/ActionReult";
import Post from "src/data/Post";

export interface PostAction {
    createPost() : Promise<Post>;
}